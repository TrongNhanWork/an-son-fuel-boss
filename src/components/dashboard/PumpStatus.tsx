import { cn } from "@/lib/utils";
import { Fuel, AlertTriangle, CheckCircle } from "lucide-react";

type FuelDto = { id: number; name: string; unitPrice: number; active: boolean };

type PumpDto = {
  id: number;
  code: string;
  active: boolean;
  fuelId: number;
  tankId?: number | null;
  fuel?: FuelDto | null;
};

interface PumpStatusProps {
  pumps: PumpDto[];
}

// Map màu theo fuelId (seed của bạn: 1=RON95, 2=E5, 3=DO)
const fuelColorsById: Record<number, string> = {
  1: "bg-primary",   // RON95
  2: "bg-success",   // E5
  3: "bg-secondary", // DO
};

function getFuelLabel(p: PumpDto) {
  // Hiển thị đẹp hơn: nếu có fuel.name thì dùng, không thì fallback fuelId
  return p.fuel?.name ?? `Fuel #${p.fuelId}`;
}

function getFuelDotClass(p: PumpDto) {
  return fuelColorsById[p.fuelId] ?? "bg-muted-foreground";
}

export function PumpStatus({ pumps }: PumpStatusProps) {
  const activeCount = pumps.filter((p) => p.active).length;

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="border-b p-4">
        <h3 className="font-semibold">Trạng thái trụ bơm</h3>
        <p className="text-sm text-muted-foreground">
          {activeCount}/{pumps.length} trụ hoạt động
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {pumps.map((pump, index) => {
          const status = pump.active ? "active" : "inactive";

          return (
            <div
              key={pump.id}
              className={cn(
                "relative rounded-lg border p-3 transition-all animate-fade-in",
                status === "active" ? "bg-card hover:shadow-md" : "bg-muted/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("h-2 w-2 rounded-full", getFuelDotClass(pump))} />
                {status === "active" ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{pump.code}</span>
              </div>

              <p className="text-xs text-muted-foreground mt-1">{getFuelLabel(pump)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}