package br.com.voltic.dto.measurement;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import br.com.voltic.entity.Measurement;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Schema(description = "DTO para envio de lote de medições.")
public class MeasurementBatchDTO {

    @NotNull
    @Schema(description = "ID do dispositivo ao qual as medições pertencem.", required = true)
    private String deviceId;

    @NotEmpty
    @Schema(description = "Lista de medições a serem inseridas.", required = true)
    private List<MeasurementDTO> measurements;

    public List<Measurement> toDomain() {
        return measurements.stream()
                .map(dto -> new Measurement(
                        deviceId,
                        dto.getTimestamp(),
                        dto.getCurrentRms(),
                        dto.getVoltageRms()
                ))
                .collect(Collectors.toList());
    }
}
