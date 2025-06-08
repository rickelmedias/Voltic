package br.com.voltic.dto.measurement;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.Instant;

@Data
@Schema(description = "DTO de resposta para uma medição.")
public class MeasurementResponseDTO {

    @Schema(description = "ID interno da medição.", example = "60f1d5a8b3c2f6473c8f9e13")
    private String id;

    @Schema(description = "Identificador do dispositivo dessa medição.", example = "esp32-001")
    private String deviceId;

    @Schema(description = "Timestamp da medição.")
    private Instant timestamp;

    @Schema(description = "Corrente RMS medida.")
    private double currentRms;

    @Schema(description = "Tensão RMS medida.")
    private double voltageRms;

    public static MeasurementResponseDTO from(br.com.voltic.entity.Measurement m) {
        MeasurementResponseDTO dto = new MeasurementResponseDTO();
        dto.setId(m.getId());
        dto.setDeviceId(m.getDeviceId());
        dto.setTimestamp(m.getTimestamp());
        dto.setCurrentRms(m.getCurrentRms());
        dto.setVoltageRms(m.getVoltageRms());
        return dto;
    }
}
