package br.com.voltic.dto.dashboard;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Ponto de dados para gráficos do dashboard.")
public class DashboardDataPointDTO {

    @Schema(description = "Momento da medição", example = "2025-05-20T14:00:00Z")
    private Instant timestamp;

    @Schema(description = "Corrente RMS medida", example = "2.5")
    private double currentRms;

    @Schema(description = "Tensão RMS medida", example = "220.0")
    private double voltageRms;

    @Schema(description = "Consumo estimado (kWh)", example = "0.0091")
    private double consumption;
} 
