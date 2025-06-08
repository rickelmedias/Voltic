import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useGetDashboardData } from "@/api/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, startOfDay, addDays } from "date-fns";

const eachDayOfInterval = ({ start, end }: { start: Date; end: Date }) => {
  const days: Date[] = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }
  return days;
};

const eachMinuteOfInterval = ({ start, end }: { start: Date; end: Date }) => {
  const mins: Date[] = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    mins.push(new Date(cursor));
    cursor = new Date(cursor.getTime() + 60_000);
  }
  return mins;
};

interface DashboardDataItem {
  timestamp: string;
  currentRms: number;
  voltageRms: number;
  consumption: number;
  [key: string]: any;
}

type Metric = "currentRms" | "voltageRms" | "consumption";

const labels: Record<Metric, string> = {
  currentRms: "Corrente RMS (A)",
  voltageRms: "Tensão RMS (V)",
  consumption: "Consumo (kWh)",
};

const colors: Record<Metric, string> = {
  currentRms: "#16a34a",
  voltageRms: "#dc2626",
  consumption: "#f97316",
};

export function ChartAreaInteractive({ deviceId }: { deviceId: string }) {
  const isMobile = useIsMobile();
  const [active, setActive] = React.useState<Record<Metric, boolean>>({
    currentRms: true,
    voltageRms: true,
    consumption: true,
  });

  const [range, setRange] = React.useState<"1d" | "7d" | "30d" | "90d">("30d");
  React.useEffect(() => {
    if (isMobile) setRange("7d");
  }, [isMobile]);

  const days = range === "1d" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const now = new Date();
  const start = addDays(now, -days + (days === 1 ? 0 : 1));

  const { data = [], isLoading } = useGetDashboardData(
    deviceId,
    { days },
    { query: { refetchInterval: 60_000 } }
  );

  if (isLoading) return <p>Carregando gráfico…</p>;

  // prepare timeline
  type Point = { date: string; currentRms: number; voltageRms: number; consumption: number };
  let timeline: Point[] = [];

  if (days === 1) {
    // per-minute timeline
    eachMinuteOfInterval({ start, end: now }).forEach(dt => {
      timeline.push({
        date: format(dt, "HH:mm"),
        currentRms: 0,
        voltageRms: 0,
        consumption: 0,
      });
    });
    // fill raw data
    (data as DashboardDataItem[]).forEach(d => {
      const dt = new Date(d.timestamp);
      const key = format(dt, "HH:mm");
      const entry = timeline.find(e => e.date === key);
      if (entry) {
        entry.currentRms = d.currentRms;
        entry.voltageRms = d.voltageRms;
        entry.consumption = d.consumption;
      }
    });
  } else {
    // per-day timeline
    eachDayOfInterval({ start: startOfDay(start), end: now }).forEach(dt => {
      timeline.push({
        date: format(dt, "dd/MM"),
        currentRms: 0,
        voltageRms: 0,
        consumption: 0,
      });
    });
    // group by day
    const groups: Record<string, DashboardDataItem[]> = {};
    (data as DashboardDataItem[]).forEach(d => {
      const day = format(new Date(d.timestamp), "dd/MM");
      groups[day] = groups[day] || [];
      groups[day].push(d);
    });
    // aggregate
    timeline.forEach(pt => {
      const items = groups[pt.date] || [];
      if (items.length) {
        pt.currentRms = items.reduce((sum, i) => sum + i.currentRms, 0) / items.length;
        pt.voltageRms = items.reduce((sum, i) => sum + i.voltageRms, 0) / items.length;
        pt.consumption = items.reduce((sum, i) => sum + i.consumption, 0);
      }
    });
  }

  const anyActive = Object.values(active).some(Boolean);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{deviceId}</CardTitle>
        <CardDescription>Marque para mostrar / esconder a série</CardDescription>
        <Select value={range} onValueChange={v => setRange(v as any)}>
          <SelectTrigger className="absolute right-4 top-4 w-28 h-8">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="1d">1 dia</SelectItem>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <div className="flex gap-4 px-6 pb-2">
        {(Object.keys(labels) as Metric[]).map(key => (
          <label key={key} className="flex items-center gap-1 text-sm select-none">
            <Checkbox
              checked={active[key]}
              onCheckedChange={v => setActive(prev => ({ ...prev, [key]: !!v }))}
              style={{ accentColor: colors[key] }}
            />
            {labels[key]}
          </label>
        ))}
      </div>

      <CardContent className="px-2 pt-2 sm:px-6">
        <ChartContainer config={{}} className="h-[260px] w-full">
          <AreaChart data={timeline}>
            {(Object.keys(labels) as Metric[]).map(key => (
              <defs key={key}>
                <linearGradient id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[key]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[key]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
            ))}
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" labelFormatter={v => v} />} />
            {(Object.keys(labels) as Metric[]).map(
              key =>
                active[key] && (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[key]}
                    fill={`url(#fill-${key})`}
                  />
                )
            )}
            {!anyActive && <text x="50%" y="50%" textAnchor="middle">Nada selecionado</text>}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
