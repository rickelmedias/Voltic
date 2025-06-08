package br.com.voltic.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "devices")
public class Device {
    @Id
    private String id;

    private String userId;

    @Indexed(unique = true)
    private String deviceId;

    private String name;
    private String description;

    @Indexed(unique = true)
    private String activationCode;

    private boolean activated;
}
