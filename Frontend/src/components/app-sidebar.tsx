// src/components/app-sidebar.tsx
"use client";

import * as React from "react";
import { LayoutDashboard, HardDrive } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import type { DeviceResponseDTO } from "@/api/models";

export interface AppSidebarProps {
  variant?: React.ComponentProps<typeof Sidebar>["variant"];
  devices: DeviceResponseDTO[];
  selectedDevice: string | null;
  onSelectDevice: (deviceId: string) => void;
}

export function AppSidebar({
  variant = "sidebar",
  devices,
  selectedDevice,
  onSelectDevice,
  ...rest
}: AppSidebarProps) {
  return (
    <Sidebar variant={variant} {...rest}>
      {/* Cabeçalho com logo */}
      <SidebarHeader className="px-4 py-3 flex justify-center items-center">
        <Image
          src="/volticlogo.svg"
          alt="Voltic Logo"
          width={150}
          height={50}
          priority
        />
      </SidebarHeader>

      {/* Menu principal e lista de dispositivos */}
      <SidebarContent className="space-y-4">
        <NavMain
          items={[]}
        />

        <div>
          <h4 className="px-4 mb-2 text-sm font-semibold text-gray-500">
            Meus Dispositivos
          </h4>
          <ul className="space-y-1">
            {devices.map((device) => (
              <li key={device.deviceId}>
                <button
                  className={`w-full text-left px-4 py-2 rounded transition ${
                    device.deviceId === selectedDevice
                      ? "bg-blue-100 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    device.deviceId && onSelectDevice(device.deviceId)
                  }
                >
                  {device.name ?? device.deviceId}
                </button>
              </li>
            ))}
            {devices.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-400">
                Nenhum dispositivo
              </li>
            )}
          </ul>
        </div>
      </SidebarContent>

      {/* Rodapé com usuário */}
      <SidebarFooter>
        <NavUser
          user={{
            name: "Sua Conta",
            email: "",
            avatar: "/avatars/default.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
