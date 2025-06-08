package br.com.voltic.dto.device;

import br.com.voltic.entity.Device;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "Dados retornados de um dispositivo.")
@Data
public class DeviceResponseDTO {

    @Schema(description = "Identificador do dispositivo no banco", example = "507f1f77bcf86cd799439011")
    private String id;

    private String deviceId;

    private String name;

    private String description;

    private String activationCode;

    private boolean activated;

    public static DeviceResponseDTO from(Device device) {
        DeviceResponseDTO dto = new DeviceResponseDTO();
        dto.setId(device.getId());
        dto.setDeviceId(device.getDeviceId());
        dto.setName(device.getName());
        dto.setDescription(device.getDescription());
        dto.setActivationCode(device.getActivationCode());
        dto.setActivated(device.isActivated());
        return dto;
    }
}
