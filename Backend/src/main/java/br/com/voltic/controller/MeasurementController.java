package br.com.voltic.controller;

import br.com.voltic.dto.measurement.MeasurementBatchDTO;
import br.com.voltic.dto.measurement.MeasurementDTO;
import br.com.voltic.dto.measurement.MeasurementResponseDTO;
import br.com.voltic.service.MeasurementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/measurements")
@Tag(name = "Medições", description = "Gerenciamento de medições elétricas")
@SecurityRequirement(name = "bearerAuth")
public class MeasurementController {

    private final MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registra uma medição elétrica individual")
    public MeasurementResponseDTO createMeasurement(
      @Valid @RequestBody MeasurementDTO measurementDTO
    ) {
        return measurementService.saveMeasurement(measurementDTO);
    }

    @PostMapping("/batch")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @Operation(summary = "Registra um lote de medições elétricas")
    public void createMeasurementsBatch(
      @Valid @RequestBody MeasurementBatchDTO batchDTO
    ) {
        measurementService.saveBatch(batchDTO);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(
      summary = "Lista medições de um dispositivo (paginado)",
      parameters = {
        @Parameter(
          name        = "deviceId",
          in          = ParameterIn.QUERY,
          description = "ID único do dispositivo",
          required    = true,
          schema      = @Schema(type = "string")
        ),
        @Parameter(
          name = "page",
          in = ParameterIn.QUERY,
          description = "Número da página (0..N)",
          schema = @Schema(type = "integer", defaultValue = "0")
        ),
        @Parameter(
          name = "size",
          in = ParameterIn.QUERY,
          description = "Tamanho da página",
          schema = @Schema(type = "integer", defaultValue = "20")
        )
      }
    )
    public Page<MeasurementResponseDTO> getMeasurements(
      @RequestParam String deviceId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @AuthenticationPrincipal String username
    ) {
        return measurementService.getMeasurements(deviceId, PageRequest.of(page, size), username);
    }
}
