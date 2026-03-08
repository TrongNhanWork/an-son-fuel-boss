import { Clock, User, TrendingUp, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {ShiftDto } from "@/types/shift";


interface ShiftStatusProps {
  shift: ShiftDto | null;
}

export function ShiftStatus({ shift }: ShiftStatusProps) {
  const isOpen = !!shift && shift.status === 0;

  if (!isOpen) {
    return (
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-primary-foreground">
                <p className="font-semibold">Chưa mở ca</p>
                <p className="text-sm opacity-80">Vui lòng mở ca để bắt đầu bán</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
            >
              Đóng
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <Button className="w-full" variant="outline" onClick={() => (window.location.href = "/shifts")}>
            Đi tới trang Ca làm việc
          </Button>
        </div>
      </div>
    );
  }

  const openedAt = new Date(shift!.openedAt);

  const getShiftDuration = () => {
    const now = new Date();
    const diffMs = now.getTime() - openedAt.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(date);

  const revenue = shift!.revenue ?? 0;
  const expectedTotal = (shift!.openingCash ?? 0) + revenue;

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <p className="font-semibold">{shift!.code}</p>
              <p className="text-sm opacity-80">Ca đang mở</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
          >
            Open
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
              <p className="text-sm font-medium">
                {formatTime(openedAt)} - {getShiftDuration()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tiền đầu ca</p>
              <p className="text-sm font-medium">{formatCurrency(shift!.openingCash ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Doanh thu trong ca (tạm tính)</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>

          <p className="text-2xl font-bold text-primary">
            {formatCurrency(revenue)}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Tổng dự kiến thu: {formatCurrency(expectedTotal)}
          </p>
        </div>

        <Button className="w-full" variant="outline" onClick={() => (window.location.href = "/shifts")}>
          Chốt ca làm việc
        </Button>
      </div>
    </div>
  );
}