import { cn } from '@/lib/utils';
import { Pump, FuelType } from '@/types';
import { Fuel, AlertTriangle, CheckCircle } from 'lucide-react';

interface PumpStatusProps {
  pumps: Pump[];
}

const fuelColors: Record<FuelType, string> = {
  RON95: 'bg-primary',
  E5: 'bg-success',
  DO: 'bg-secondary',
};

export function PumpStatus({ pumps }: PumpStatusProps) {
  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="border-b p-4">
        <h3 className="font-semibold">Trạng thái trụ bơm</h3>
        <p className="text-sm text-muted-foreground">
          {pumps.filter((p) => p.status === 'active').length}/{pumps.length} trụ hoạt động
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {pumps.map((pump, index) => (
          <div
            key={pump.id}
            className={cn(
              'relative rounded-lg border p-3 transition-all animate-fade-in',
              pump.status === 'active' 
                ? 'bg-card hover:shadow-md' 
                : 'bg-muted/50'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn('h-2 w-2 rounded-full', fuelColors[pump.fuelType])} />
              {pump.status === 'active' ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{pump.code}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{pump.fuelType}</p>
            {pump.status === 'maintenance' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
