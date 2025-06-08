package br.com.voltic.dto.device;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Schema(description = "Resposta ao ativar o dispositivo com sucesso")
@Data
@AllArgsConstructor
public class DeviceActivationResponseDTO {
    private String deviceId;
    private String name;
    private String description;
}
