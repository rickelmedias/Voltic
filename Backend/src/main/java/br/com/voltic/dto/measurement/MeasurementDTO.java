package br.com.voltic.dto.measurement;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
@Schema(description = "DTO para criação de uma medição individual.")
public class MeasurementDTO {

    @NotBlank
    @Schema(description = "Identificador único do dispositivo.", example = "esp32-001", required = true)
    private String deviceId;

    @NotNull
    @Schema(description = "Timestamp da medição em formato ISO-8601.", example = "2025-05-20T14:00:00Z", required = true)
    private Instant timestamp;

    @NotNull
    @Schema(description = "Valor de corrente RMS (Ampère).", example = "2.5", required = true)
    private Double currentRms;

    @NotNull
    @Schema(description = "Valor de tensão RMS (Volts).", example = "220.0", required = true)
    private Double voltageRms;
}