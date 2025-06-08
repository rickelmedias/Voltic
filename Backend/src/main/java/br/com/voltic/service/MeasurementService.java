package br.com.voltic.service;

import br.com.voltic.dto.measurement.MeasurementBatchDTO;
import br.com.voltic.dto.measurement.MeasurementDTO;
import br.com.voltic.dto.measurement.MeasurementResponseDTO;
import br.com.voltic.entity.Device;
import br.com.voltic.entity.Measurement;
import br.com.voltic.entity.User;
import br.com.voltic.mapper.MeasurementMapper;
import br.com.voltic.repository.DeviceRepository;
import br.com.voltic.repository.MeasurementRepository;
import br.com.voltic.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MeasurementService {

    private final MeasurementRepository measurementRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final MeasurementMapper measurementMapper;

    public MeasurementService(MeasurementRepository measurementRepository,
                              DeviceRepository deviceRepository,
                              UserRepository userRepository,
                              MeasurementMapper measurementMapper) {
        this.measurementRepository = measurementRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
        this.measurementMapper = measurementMapper;
    }

    public MeasurementResponseDTO saveMeasurement(MeasurementDTO dto) {
        Measurement measurement = measurementMapper.toEntity(dto);
        Measurement saved = measurementRepository.save(measurement);
        return measurementMapper.toResponse(saved);
    }

    public void saveBatch(MeasurementBatchDTO batchDTO) {
        List<Measurement> measurements = batchDTO.toDomain();
        measurementRepository.saveAll(measurements);
    }

    public Page<MeasurementResponseDTO> getMeasurements(String deviceId,
                                                       Pageable pageable,
                                                       String username) {
        Device device = deviceRepository.findByDeviceId(deviceId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Dispositivo não encontrado"));

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        if (!device.isActivated() || !device.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "Acesso negado ao dispositivo");
        }

        return measurementRepository
            .findByDeviceId(deviceId, pageable)
            .map(measurementMapper::toResponse);
    }
}
