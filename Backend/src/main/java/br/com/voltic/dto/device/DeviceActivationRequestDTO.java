package br.com.voltic.dto.device;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "Requisição para ativação de um dispositivo pelo código")
@Data
public class DeviceActivationRequestDTO {

    @NotBlank
    @Schema(description = "Código único do dispositivo colado no físico", example = "ABC123DEF", required = true)
    private String activationCode;
}
