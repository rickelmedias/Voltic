package br.com.voltic.repository;

import br.com.voltic.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends MongoRepository<Device, String> {
    Optional<Device> findByActivationCode(String activationCode);
    Optional<Device> findByDeviceId(String deviceId);
    List<Device> findByUserId(String userId);
    Page<Device> findByUserId(String userId, Pageable pageable);
}
