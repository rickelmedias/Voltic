package br.com.voltic.dto;

import lombok.Data;

@Data
public class RawMeasurementDTO {
    private String timestamp;
    private double correnteRms;
    private double tensaoRms;
}
