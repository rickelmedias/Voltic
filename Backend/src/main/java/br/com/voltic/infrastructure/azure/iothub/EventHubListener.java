package br.com.voltic.infrastructure.azure.iothub;

import br.com.voltic.dto.measurement.MeasurementDTO;
import br.com.voltic.entity.Measurement;
import br.com.voltic.mapper.MeasurementMapper;
import br.com.voltic.service.IngestMeasurementBatchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EventHubListener {

    private static final Logger logger = LoggerFactory.getLogger(EventHubListener.class);

    private final IngestMeasurementBatchService ingestService;
    private final MeasurementMapper measurementMapper;
    private final ObjectMapper objectMapper;

    public EventHubListener(IngestMeasurementBatchService ingestService,
                            ObjectMapper objectMapper,
                            MeasurementMapper measurementMapper) {
        this.ingestService = ingestService;
        this.objectMapper = objectMapper;
        this.measurementMapper = measurementMapper;
    }


    public void onMessage(String jsonMessage) {
        try {
            List<MeasurementDTO> measurementDTOs = objectMapper.readValue(
                jsonMessage,
                new TypeReference<List<MeasurementDTO>>() {}
            );

            if (measurementDTOs.isEmpty()) {
                logger.warn("Mensagem recebida sem medições – ignorando.");
                return;
            }

            List<Measurement> measurements = measurementDTOs.stream()
                .map(measurementMapper::toEntity)
                .toList();

            ingestService.ingest(measurements);
            logger.info("Medições inseridas com sucesso no banco de dados.");
        } catch (Exception e) {
            logger.error("Erro ao processar mensagem do IoT Hub", e);
        }
    }

}
