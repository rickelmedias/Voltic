package br.com.voltic.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "measurements")
public class Measurement {
    @Id
    private String id;

    @Indexed
    private String deviceId;

    @Indexed
    private Instant timestamp;

    private double currentRms;
    private double voltageRms;

    public Measurement(String deviceId, Instant timestamp, double currentRms, double voltageRms) {
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.currentRms = currentRms;
        this.voltageRms = voltageRms;
    }
}
