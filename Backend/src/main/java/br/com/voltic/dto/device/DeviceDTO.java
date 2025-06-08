package br.com.voltic.dto.device;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "Dados para criação de um dispositivo.")
@Data
public class DeviceDTO {

    @NotBlank
    @Schema(description = "ID único do dispositivo (ex: ESP32 serial)", example = "esp32-001", required = true)
    private String deviceId;

    @NotBlank
    @Schema(description = "Nome amigável do dispositivo", example = "Medidor Sala", required = true)
    private String name;

    @Schema(description = "Descrição opcional", example = "Dispositivo da tomada da sala")
    private String description;
}
