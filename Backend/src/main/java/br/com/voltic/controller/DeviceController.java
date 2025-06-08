package br.com.voltic.controller;

import br.com.voltic.dto.dashboard.DashboardDataPointDTO;
import br.com.voltic.dto.device.DeviceActivationRequestDTO;
import br.com.voltic.dto.device.DeviceActivationResponseDTO;
import br.com.voltic.dto.device.DeviceDTO;
import br.com.voltic.dto.device.DeviceResponseDTO;
import br.com.voltic.service.DeviceService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
@Tag(name = "Dispositivos", description = "Gerenciamento de dispositivos")
@SecurityRequirement(name = "bearerAuth")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastra um novo dispositivo físico")
    public DeviceResponseDTO createDevice(
        @Valid @RequestBody DeviceDTO deviceDTO
    ) {
        return deviceService.createDevice(deviceDTO);
    }

    @PostMapping("/activate")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Ativa e associa um dispositivo pelo código")
    public DeviceActivationResponseDTO activateDevice(
        @Valid @RequestBody DeviceActivationRequestDTO request,
        @AuthenticationPrincipal String username
    ) {
        return deviceService.activateDevice(request.getActivationCode(), username);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
      summary = "Lista todos os dispositivos cadastrados",
      parameters = {
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
    public Page<DeviceResponseDTO> getDevices(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return deviceService.getAllDevices(PageRequest.of(page, size));
    }

    @GetMapping("/byUser")
    @PreAuthorize("hasRole('USER')")
    @Operation(
      summary = "Lista dispositivos do usuário autenticado",
      parameters = {
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
    public Page<DeviceResponseDTO> getDevicesByUser(
        @AuthenticationPrincipal String username,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return deviceService.getDevicesByUsername(username, PageRequest.of(page, size));
    }

    @GetMapping("/{deviceId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Busca um dispositivo pelo seu ID único")
    public ResponseEntity<DeviceResponseDTO> getDeviceById(
        @PathVariable String deviceId
    ) {
        DeviceResponseDTO dto = deviceService.getDeviceByDeviceId(deviceId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{deviceId}/dashboard")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Retorna dados de gráfico para o dashboard")
    public List<DashboardDataPointDTO> getDashboardData(
        @PathVariable String deviceId,

        @RequestParam(name = "days", defaultValue = "30")
        @Parameter(
          name = "days",
          in = ParameterIn.QUERY,
          description = "Período em dias",
          schema = @Schema(type = "integer", defaultValue = "30")
        )
        int days,

        @AuthenticationPrincipal String username
    ) {
        return deviceService.getDashboardData(deviceId, days, username);
    }

    @PutMapping("/{deviceId}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Atualiza o nome e descrição de um dispositivo do usuário autenticado")
    public ResponseEntity<DeviceResponseDTO> updateDevice(
        @PathVariable String deviceId,
        @Valid @RequestBody DeviceDTO deviceDTO,
        @AuthenticationPrincipal String username
    ) {
        DeviceResponseDTO updatedDevice = deviceService.updateDevice(deviceId, deviceDTO, username);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{deviceId}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Exclui um dispositivo do usuário autenticado")
    public ResponseEntity<Void> deleteDevice(
        @PathVariable String deviceId,
        @AuthenticationPrincipal String username
    ) {
        deviceService.deleteDevice(deviceId, username);
        return ResponseEntity.noContent().build();
    }
}