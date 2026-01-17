import { Clock, User, TrendingUp, Receipt } from 'lucide-react';
import { Shift } from '@/types';
import { formatCurrency, formatNumber } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ShiftStatusProps {
  shift: Shift;
}

export function ShiftStatus({ shift }: ShiftStatusProps) {
  const getShiftDuration = () => {
    const now = new Date();
    const diffMs = now.getTime() - shift.startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <p className="font-semibold">{shift.employeeName}</p>
              <p className="text-sm opacity-80">Nhân viên bán hàng</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Ca đang mở
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Thời gian</p>
              <p className="text-sm font-medium">{formatTime(shift.startTime)} - {getShiftDuration()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Giao dịch</p>
              <p className="text-sm font-medium">{shift.totalTransactions} giao dịch</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Doanh thu ca</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(shift.totalRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatNumber(shift.totalQuantity)} lít đã bán
          </p>
        </div>

        <Button className="w-full" variant="outline">
          Chốt ca làm việc
        </Button>
      </div>
    </div>
  );
}
