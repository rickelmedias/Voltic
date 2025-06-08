#define SAS_TOKEN           "SharedAccessSignature [...]"
#define WIFI_SSID           "Nome_Minha_Rede"
#define WIFI_PASSWORD       "Senha_Minha_Rede"
#define DEVICE_ID           "IoTHub_Device"     // ex: ESP00
#define IOTHUB_HOSTNAME     "IoTHub_Hostname"   // ex: "..azure-device.net"
#define IOTHUB_API_VER      "2020-09-30"

#define BATCH_SIZE          60
#define READ_INTERVAL_MS    1000UL              // 1s

#define VOLTAGE_MOCK_127    1
#define VOLTAGE_MOCK_220    2
#define VOLTAGE_SENSOR      3
#define VOLTAGE_MODE        VOLTAGE_MOCK_127    // Troque para VOLTAGE_SENSOR se medir tensão real, caso contrario pode usar tensao mockada.
const float VOLTAGE_CAL =   111.11;             // Usado apenas se medir tensão real (ajustavel)

#define PIN_CURR            35                  // ACS712 OUT
#define PIN_VOLT            34                  // ZMPT101B OUT (Se usar tensão real)
#define LED_GREEN           21                  // Led que indica funcionamento ja conectado a rede Wifi
#define LED_YELLOW          19                  // Led que indica tentando conectar wifi (quando aceso), se tiver apagado e o verde aceso, ele indica: 
                                                                                                        /* 
                                                                                                            - Uma piscada enviou dado para IoTHub, duas piscadas 
                                                                                                            - Duas piscadas nao conseguiu enviar o dado (Pode ser erro de autorizacao/autenticacao (401/403))   
                                                                                                         
                                                                                                            Nesse segundo caso, para solucionar o problema, foi necessario gerar um novo token (SAS_TOKEN) para enviar dados.
                                                                                                            Esse token tem um tempo de expiracao e um dipositivo associado, assim consegue enviar dado durante aquele tempo.
                                                                                                         */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ACS712.h>
#include "EmonLib.h"
#include <time.h>

/* ====== VARIÁVEL DE CALIBRAÇÃO ====== */
// Calibração inicial ajustada baseada na medição real (12.9A lido vs 15A real)
// Fator de correção: 15/12.9 = 1.163
float mVPerAmp = 66.0 * (12.9 / 15.0); // ≈ 56.76 mV/A

/* ====== OBJETOS GLOBAIS ====== */
// Use resolução 12 bits (0-4095) no ESP32, Vref = 3.3V
ACS712 acs(PIN_CURR, 3.3, 4095, mVPerAmp);
EnergyMonitor emonV;

struct Measurement {
  double voltageRms;
  double currentRms;
  unsigned long timestamp;
};
Measurement buffer[BATCH_SIZE];
uint8_t bufIdx = 0;

DynamicJsonDocument doc(8192);
char payload[7000];

/* ====== CONEXÃO WI-FI ====== */
void connectWiFi() {
  Serial.print("WiFi…");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  for (int t = 0; WiFi.status() != WL_CONNECTED && t < 30; ++t) {
    delay(500); Serial.print('.');
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? " OK" : " FAIL");
}

/* ====== ENVIO DE DADOS ====== */
void sendBatch() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Sem Wi-Fi."); return;
  }
  
  // Criar array de medições individuais conforme esperado pelo Java
  doc.clear();
  JsonArray measurements = doc.to<JsonArray>();
  
  for (uint8_t i = 0; i < bufIdx; i++) {
    JsonObject measurement = measurements.createNestedObject();
    measurement["deviceId"] = DEVICE_ID;
    
    // Converter timestamp Unix para formato ISO-8601
    time_t rawTime = (time_t)buffer[i].timestamp;
    struct tm* timeInfo = gmtime(&rawTime);
    char isoTimestamp[32];
    strftime(isoTimestamp, sizeof(isoTimestamp), "%Y-%m-%dT%H:%M:%S.000Z", timeInfo);
    measurement["timestamp"] = isoTimestamp;
    
    // Nomes corretos dos campos conforme DTO Java
    measurement["currentRms"] = buffer[i].currentRms;
    measurement["voltageRms"] = buffer[i].voltageRms;
  }
  
  size_t n = serializeJson(doc, payload, sizeof(payload));

  HTTPClient http;
  String url = String("https://") + IOTHUB_HOSTNAME + "/devices/" + DEVICE_ID +
               "/messages/events?api-version=" + IOTHUB_API_VER;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", SAS_TOKEN);
  int code = http.POST((uint8_t*)payload, n);
  Serial.printf("HTTP %d\n", code);
  
  // Debug: Mostrar JSON enviado
  Serial.println("JSON enviado:");
  Serial.println(payload);
  
  http.end();

  if (code >= 200 && code < 300) {
    bufIdx = 0;
    digitalWrite(LED_YELLOW, HIGH);
    delay(200);
    digitalWrite(LED_YELLOW, LOW);
  } else {
    Serial.println("Falha no envio — manter lote.");
  }
}

/* ====== SETUP ====== */
void setup() {
  Serial.begin(115200);
  delay(1500);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);

  // Configura ADC 12 bits
  analogSetWidth(12);

  // Tensão real opcional
  if (VOLTAGE_MODE == VOLTAGE_SENSOR) {
    emonV.voltage(PIN_VOLT, VOLTAGE_CAL, 1.7);
  }

  // Calibração inicial do ACS712 com valor corrigido
  acs.autoMidPoint(60, 2);              // 2 ciclos de 60Hz
  acs.setFormFactor(ACS712_FF_SINUS);   // ≈0.707
  Serial.printf("Midpoint=%u FormFactor=%.3f mV/A=%.2f\n",
                acs.getMidPoint(), acs.getFormFactor(), mVPerAmp);

  connectWiFi();

  // Configura NTP
  configTime(-3*3600, 0, "pool.ntp.org", "time.nist.gov");
  for (int t=0; time(nullptr) < 100000 && t<10; t++) {
    delay(500);
    Serial.print('.');
  }
  Serial.println("\nPronto!");
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_YELLOW, LOW);

  Serial.println("Para calibrar, digite no Serial: C <corrente_real_em_A>");
  Serial.println("Calibração inicial aplicada para corrigir 12.9A → 15A");
}

/* ====== LOOP ====== */
void loop() {
  // Sistema de calibração
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();
    
    if (line.startsWith("C ") || line.startsWith("c ")) {
      float realA = line.substring(2).toFloat();
      
      if (realA <= 0) {
        Serial.println("Erro: Valor de corrente deve ser maior que zero!");
        return;
      }

      // Fazer múltiplas leituras para maior precisão
      float totalMeasured = 0;
      int numReadings = 5;
      
      Serial.println("Fazendo múltiplas leituras para calibração...");
      for (int i = 0; i < numReadings; i++) {
        float measMA = acs.mA_AC(60, 2);
        totalMeasured += measMA;
        delay(100);
        Serial.printf("Leitura %d: %.2f mA\n", i+1, measMA);
      }
      
      float avgMeasMA = totalMeasured / numReadings;
      float measA = avgMeasMA / 1000.0;
      
      if (measA > 0.01) { // Evitar divisão por valores muito pequenos
        float correctionFactor = realA / measA;
        mVPerAmp = mVPerAmp / correctionFactor; // Ajuste inverso
        acs.setmVperAmp(mVPerAmp);
        
        Serial.printf("=== CALIBRAÇÃO COMPLETA ===\n");
        Serial.printf("Média medida: %.2f A\n", measA);
        Serial.printf("Valor real: %.2f A\n", realA);
        Serial.printf("Fator correção: %.3f\n", correctionFactor);
        Serial.printf("Novo mV/A: %.2f\n", mVPerAmp);
        Serial.printf("========================\n");
      } else {
        Serial.println("Erro: Corrente medida muito baixa para calibração!");
      }
    }
  }

  static unsigned long last = 0;
  unsigned long now = millis();
  if (now - last < READ_INTERVAL_MS) return;
  last = now;

  // Leitura de tensão
  double vRms = (VOLTAGE_MODE == VOLTAGE_SENSOR)
                 ? emonV.calcIrms(1480)
                 : (VOLTAGE_MODE == VOLTAGE_MOCK_127 ? 127.0 : 220.0);

  // Leitura de corrente RMS com filtro para ruído
  float iMA = acs.mA_AC(60, 2);
  double iA = iMA / 1000.0;
  
  // Filtro para eliminar ruído em baixas correntes
  if (iA < 0.02) iA = 0.0;
  
  // Garantir que não há valores nulos
  if (isnan(vRms)) vRms = 0.0;
  if (isnan(iA)) iA = 0.0;

  unsigned long ts = (unsigned long)time(nullptr);
  buffer[bufIdx++] = { vRms, iA, ts };

  // Debug
  char tStr[20];
  strftime(tStr, sizeof(tStr), "%d/%m %H:%M:%S", localtime((time_t*)&ts));
  double pW = vRms * iA;
  Serial.printf("Med %u (%s): V=%.1f I=%.3f P=%.1f\n",
                bufIdx, tStr, vRms, iA, pW);

  if (bufIdx >= BATCH_SIZE) {
    sendBatch();
  }
}