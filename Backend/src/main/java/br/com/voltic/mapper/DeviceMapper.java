package br.com.voltic.mapper;

import org.mapstruct.Mapper;

import br.com.voltic.dto.device.DeviceDTO;
import br.com.voltic.dto.device.DeviceResponseDTO;
import br.com.voltic.entity.Device;

@Mapper(componentModel = "spring")
public interface DeviceMapper {
    Device toEntity(DeviceDTO dto);
    DeviceResponseDTO toResponse(Device device);
}
