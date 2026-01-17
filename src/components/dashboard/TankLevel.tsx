import { cn } from '@/lib/utils';
import { FuelType } from '@/types';
import { formatNumber } from '@/data/mockData';

interface TankLevelProps {
  fuelType: FuelType;
  level: number;
  maxCapacity: number;
  percentage: number;
}

const fuelConfig: Record<FuelType, { label: string; color: string; bgColor: string }> = {
  RON95: { label: 'Xăng RON 95', color: 'bg-primary', bgColor: 'bg-primary/20' },
  E5: { label: 'Xăng E5', color: 'bg-success', bgColor: 'bg-success/20' },
  DO: { label: 'Dầu DO', color: 'bg-secondary', bgColor: 'bg-secondary/20' },
};

export function TankLevel({ fuelType, level, maxCapacity, percentage }: TankLevelProps) {
  const config = fuelConfig[fuelType];
  const isWarning = percentage < 40;
  const isCritical = percentage < 20;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', config.color)} />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <span className={cn(
          'text-sm font-bold',
          isCritical ? 'text-destructive' : isWarning ? 'text-warning' : 'text-foreground'
        )}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className={cn('h-3 rounded-full overflow-hidden', config.bgColor)}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isCritical ? 'bg-destructive' : isWarning ? 'bg-warning' : config.color
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatNumber(level)} lít</span>
        <span>/ {formatNumber(maxCapacity)} lít</span>
      </div>
    </div>
  );
}
