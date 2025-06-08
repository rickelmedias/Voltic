package br.com.voltic.service;

import br.com.voltic.dto.dashboard.DashboardDataPointDTO;
import br.com.voltic.dto.device.DeviceActivationResponseDTO;
import br.com.voltic.dto.device.DeviceDTO;
import br.com.voltic.dto.device.DeviceResponseDTO;
import br.com.voltic.entity.Device;
import br.com.voltic.entity.Measurement;
import br.com.voltic.entity.User;
import br.com.voltic.mapper.DeviceMapper;
import br.com.voltic.repository.DeviceRepository;
import br.com.voltic.repository.MeasurementRepository;
import br.com.voltic.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final MeasurementRepository measurementRepository;
    private final DeviceMapper deviceMapper;

    public DeviceService(DeviceRepository deviceRepository,
                         UserRepository userRepository,
                         MeasurementRepository measurementRepository,
                         DeviceMapper deviceMapper) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
        this.measurementRepository = measurementRepository;
        this.deviceMapper = deviceMapper;
    }

    public DeviceResponseDTO createDevice(DeviceDTO dto) {
        Device device = deviceMapper.toEntity(dto);
        device.setActivationCode(UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        device.setActivated(false);
        Device saved = deviceRepository.save(device);
        return deviceMapper.toResponse(saved);
    }

    public DeviceActivationResponseDTO activateDevice(String activationCode, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        Device device = deviceRepository.findByActivationCode(activationCode)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Código de ativação inválido"));

        if (device.isActivated()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Dispositivo já foi ativado");
        }

        device.setActivated(true);
        device.setUserId(user.getId());
        Device updated = deviceRepository.save(device);

        return new DeviceActivationResponseDTO(
            updated.getDeviceId(),
            updated.getName(),
            updated.getDescription()
        );
    }

    public Page<DeviceResponseDTO> getAllDevices(Pageable pageable) {
        return deviceRepository.findAll(pageable)
            .map(deviceMapper::toResponse);
    }

    public Page<DeviceResponseDTO> getDevicesByUsername(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        return deviceRepository.findByUserId(user.getId(), pageable)
            .map(deviceMapper::toResponse);
    }

    public DeviceResponseDTO getDeviceByDeviceId(String deviceId) {
        return deviceRepository.findByDeviceId(deviceId)
            .map(deviceMapper::toResponse)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dispositivo não encontrado"));
    }

    public DeviceResponseDTO updateDevice(String deviceId, DeviceDTO dto, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        Device device = deviceRepository.findByDeviceId(deviceId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dispositivo não encontrado"));

        if (!device.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Dispositivo não pertence ao usuário");
        }

        device.setName(dto.getName());
        device.setDescription(dto.getDescription());

        Device updated = deviceRepository.save(device);
        return deviceMapper.toResponse(updated);
    }

    public void deleteDevice(String deviceId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        Device device = deviceRepository.findByDeviceId(deviceId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dispositivo não encontrado"));

        if (!device.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Dispositivo não pertence ao usuário");
        }

        deviceRepository.delete(device);
    }

    public List<DashboardDataPointDTO> getDashboardData(String deviceId, int days, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        Device device = deviceRepository.findByDeviceId(deviceId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dispositivo não encontrado"));

        if (!device.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Dispositivo não pertence ao usuário");
        }

        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<Measurement> measurements = measurementRepository.findByDeviceIdAndTimestampAfter(deviceId, since);

        return measurements.stream()
            .map(m -> {
                double consumption = (m.getCurrentRms() * m.getVoltageRms()) / 1000.0 / 60.0;
                return new DashboardDataPointDTO(
                    m.getTimestamp(),
                    m.getCurrentRms(),
                    m.getVoltageRms(),
                    consumption
                );
            })
            .collect(Collectors.toList());
    }
}