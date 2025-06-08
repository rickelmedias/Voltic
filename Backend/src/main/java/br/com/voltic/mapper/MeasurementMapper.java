package br.com.voltic.mapper;

import org.mapstruct.Mapper;

import br.com.voltic.dto.measurement.MeasurementDTO;
import br.com.voltic.dto.measurement.MeasurementResponseDTO;
import br.com.voltic.entity.Measurement;

@Mapper(componentModel = "spring")
public interface MeasurementMapper {
    Measurement toEntity(MeasurementDTO dto);
    MeasurementResponseDTO toResponse(Measurement m);
}
