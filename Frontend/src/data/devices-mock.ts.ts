// src/data/devices-mock.ts
import type { DeviceRow } from "@/components/data-table"

export const devicesMock: DeviceRow[] = [
  {
    deviceId: "ESP00",
    correnteRms: 4.44,
    tensaoRms: 232.4,
    consumo: 1.03,
  },
  {
    deviceId: "ESP01",
    correnteRms: 3.4,
    tensaoRms: 231.4,
    consumo: 0.79,
  },
  {
    deviceId: "ESP02",
    correnteRms: 2.94,
    tensaoRms: 227.3,
    consumo: 0.67,
  },
]               // ← sem “as const”
