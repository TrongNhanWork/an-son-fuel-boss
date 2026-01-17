import { AlertTriangle, Droplets, ArrowUp, ArrowDown, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { storageTanks, fuels, formatNumber, formatCurrency } from '@/data/mockData';
import { FuelType } from '@/types';

const fuelColors: Record<FuelType, { bg: string; text: string; progress: string }> = {
  RON95: { bg: 'bg-primary/10', text: 'text-primary', progress: 'bg-primary' },
  E5: { bg: 'bg-success/10', text: 'text-success', progress: 'bg-success' },
  DO: { bg: 'bg-secondary/10', text: 'text-secondary', progress: 'bg-secondary' },
};

export default function Inventory() {
  const getFuelName = (type: FuelType) => {
    return fuels.find((f) => f.type === type)?.name || type;
  };

  const getFuelPrice = (type: FuelType) => {
    return fuels.find((f) => f.type === type)?.price || 0;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý tồn kho</h1>
          <p className="text-muted-foreground">
            Theo dõi mức tồn kho các bể chứa nhiên liệu
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            Lịch sử biến động
          </Button>
          <Button className="gap-2">
            <ArrowDown className="h-4 w-4" />
            Điều chỉnh tồn kho
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {storageTanks.map((tank, index) => {
          const percentage = (tank.currentLevel / tank.maxCapacity) * 100;
          const colors = fuelColors[tank.fuelType];
          const isWarning = tank.currentLevel <= tank.warningLevel;
          const isCritical = tank.currentLevel <= tank.warningLevel * 0.5;
          const value = tank.currentLevel * getFuelPrice(tank.fuelType);

          return (
            <Card
              key={tank.id}
              className={cn(
                'relative overflow-hidden animate-fade-in',
                isWarning && 'border-warning',
                isCritical && 'border-destructive'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isWarning && (
                <div className="absolute top-0 right-0 m-3">
                  <AlertTriangle
                    className={cn(
                      'h-5 w-5',
                      isCritical ? 'text-destructive' : 'text-warning'
                    )}
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={cn('rounded-lg p-2', colors.bg)}>
                    <Droplets className={cn('h-5 w-5', colors.text)} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tank.code}</CardTitle>
                    <CardDescription>{getFuelName(tank.fuelType)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mức hiện tại</span>
                    <span className={cn('font-bold', colors.text)}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      'h-3',
                      isWarning && '[&>div]:bg-warning',
                      isCritical && '[&>div]:bg-destructive'
                    )}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatNumber(tank.currentLevel)} lít</span>
                    <span>/ {formatNumber(tank.maxCapacity)} lít</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Mức cảnh báo</p>
                    <p className="text-sm font-medium">{formatNumber(tank.warningLevel)} lít</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Giá trị tồn</p>
                    <p className="text-sm font-medium">{formatCurrency(value)}</p>
                  </div>
                </div>

                {isWarning && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'w-full justify-center',
                      isCritical
                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                        : 'bg-warning/10 text-warning border-warning/20'
                    )}
                  >
                    {isCritical ? 'Cần nhập hàng gấp!' : 'Dưới mức cảnh báo'}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inventory Movement History */}
      <Card>
        <CardHeader>
          <CardTitle>Biến động tồn kho gần đây</CardTitle>
          <CardDescription>Lịch sử nhập, xuất và điều chỉnh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'import', tank: 'BE-01', fuel: 'RON95', qty: 10000, time: '2 ngày trước' },
              { type: 'sale', tank: 'BE-02', fuel: 'E5', qty: -1250, time: '4 giờ trước' },
              { type: 'adjust', tank: 'BE-03', fuel: 'DO', qty: -50, time: '1 ngày trước' },
              { type: 'import', tank: 'BE-02', fuel: 'E5', qty: 12000, time: '3 ngày trước' },
              { type: 'sale', tank: 'BE-01', fuel: 'RON95', qty: -850, time: '6 giờ trước' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      item.type === 'import'
                        ? 'bg-success/10'
                        : item.type === 'sale'
                        ? 'bg-primary/10'
                        : 'bg-warning/10'
                    )}
                  >
                    {item.type === 'import' ? (
                      <ArrowUp className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDown
                        className={cn(
                          'h-5 w-5',
                          item.type === 'sale' ? 'text-primary' : 'text-warning'
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {item.type === 'import'
                        ? 'Nhập kho'
                        : item.type === 'sale'
                        ? 'Bán hàng'
                        : 'Điều chỉnh hao hụt'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.tank} • {item.fuel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'font-semibold',
                      item.qty > 0 ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {item.qty > 0 ? '+' : ''}
                    {formatNumber(item.qty)} lít
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
