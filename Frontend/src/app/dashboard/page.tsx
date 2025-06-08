"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetDevicesByUser } from "@/api/hooks";
import type { DeviceResponseDTO } from "@/api/models";

export default function DashboardPage() {
  const { data: page, isLoading } = useGetDevicesByUser({
    page: 0,
    size: 10
  });


  const devices: DeviceResponseDTO[] = page?.content ?? [];

  const [selectedDeviceId, setSelectedDeviceId] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(devices[0].deviceId ?? null);
    }
  }, [devices, selectedDeviceId]);

  if (isLoading) {
    return <p className="p-4">Carregando dispositivos…</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        devices={devices}
        selectedDevice={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
      />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col gap-6 p-6">
          {selectedDeviceId && (
            <div className="space-y-6">
              <ChartAreaInteractive deviceId={selectedDeviceId} />

              <DataTable
                data={devices}
                columns={[
                  { header: "ID do Dispositivo", accessorKey: "deviceId" },
                  { header: "Nome", accessorKey: "name" },
                  { header: "Descrição", accessorKey: "description" },
                  {
                    header: "Ativado?",
                    accessorKey: "activated",
                    cell: (info) =>
                      info.row.original.activated ? "Sim" : "Não",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}