package br.com.voltic.repository;

import br.com.voltic.entity.Measurement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MeasurementRepository extends MongoRepository<Measurement, String> {
    List<Measurement> findByDeviceIdAndTimestampAfter(String deviceId, Instant since);
    Page<Measurement> findByDeviceId(String deviceId, Pageable pageable);
}
