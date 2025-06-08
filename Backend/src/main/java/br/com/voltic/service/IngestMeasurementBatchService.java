package br.com.voltic.service;

import br.com.voltic.entity.Measurement;
import br.com.voltic.repository.MeasurementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngestMeasurementBatchService {

    private final MeasurementRepository measurementRepository;

    public IngestMeasurementBatchService(MeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
    }

    public void ingest(List<Measurement> measurements) {
        measurementRepository.saveAll(measurements);
    }
}
