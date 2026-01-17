import { useState } from 'react';
import { Clock, Play, Square, User, TrendingUp, Receipt, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { currentShift, formatCurrency, formatNumber } from '@/data/mockData';

export default function Shifts() {
  const [isOpenShiftDialog, setIsOpenShiftDialog] = useState(false);
  const [isCloseShiftDialog, setIsCloseShiftDialog] = useState(false);
  const [startingCash, setStartingCash] = useState('');
  const [actualCash, setActualCash] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getShiftDuration = () => {
    const now = new Date();
    const diffMs = now.getTime() - currentShift.startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} giờ ${minutes} phút`;
  };

  const shiftHistory = [
    {
      id: 1,
      employee: 'Lê Văn Cường',
      date: '16/01/2026',
      start: '06:00',
      end: '14:00',
      transactions: 89,
      revenue: 42500000,
      status: 'closed',
    },
    {
      id: 2,
      employee: 'Trần Thị Bình',
      date: '15/01/2026',
      start: '14:00',
      end: '22:00',
      transactions: 76,
      revenue: 38200000,
      status: 'closed',
    },
    {
      id: 3,
      employee: 'Lê Văn Cường',
      date: '15/01/2026',
      start: '06:00',
      end: '14:00',
      transactions: 92,
      revenue: 45100000,
      status: 'closed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý ca làm việc</h1>
          <p className="text-muted-foreground">
            Mở ca, theo dõi và chốt ca làm việc
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isOpenShiftDialog} onOpenChange={setIsOpenShiftDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Mở ca mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Mở ca làm việc</DialogTitle>
                <DialogDescription>
                  Nhập tiền mặt đầu ca để bắt đầu làm việc
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="startingCash">Tiền mặt đầu ca</Label>
                  <Input
                    id="startingCash"
                    type="number"
                    placeholder="Nhập số tiền"
                    value={startingCash}
                    onChange={(e) => setStartingCash(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpenShiftDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsOpenShiftDialog(false)}>
                  Xác nhận mở ca
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCloseShiftDialog} onOpenChange={setIsCloseShiftDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Square className="h-4 w-4" />
                Chốt ca
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card">
              <DialogHeader>
                <DialogTitle>Chốt ca làm việc</DialogTitle>
                <DialogDescription>
                  Xác nhận số liệu và kết thúc ca làm việc
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tổng giao dịch</span>
                    <span className="font-medium">{currentShift.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tổng sản lượng</span>
                    <span className="font-medium">{formatNumber(currentShift.totalQuantity)} lít</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doanh thu ca</span>
                    <span className="font-bold text-primary">{formatCurrency(currentShift.totalRevenue)}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="actualCash">Tiền mặt thực thu</Label>
                  <Input
                    id="actualCash"
                    type="number"
                    placeholder="Nhập số tiền thực tế"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ghi chú cho ca làm việc..."
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCloseShiftDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsCloseShiftDialog(false)}>
                  Xác nhận chốt ca
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Shift */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Ca đang mở</CardTitle>
                <CardDescription>{formatDate(currentShift.startTime)}</CardDescription>
              </div>
            </div>
            <Badge className="bg-success text-success-foreground">
              <span className="mr-1 h-2 w-2 rounded-full bg-success-foreground animate-pulse inline-block" />
              Đang hoạt động
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nhân viên</p>
                <p className="font-semibold">{currentShift.employeeName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="font-semibold">
                  {formatTime(currentShift.startTime)} • {getShiftDuration()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Receipt className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giao dịch</p>
                <p className="font-semibold">{currentShift.totalTransactions} giao dịch</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doanh thu ca</p>
                <p className="font-bold text-primary text-lg">
                  {formatCurrency(currentShift.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {formatNumber(currentShift.totalQuantity)}
              </p>
              <p className="text-sm text-muted-foreground">Lít đã bán</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(currentShift.startingCash)}
              </p>
              <p className="text-sm text-muted-foreground">Tiền đầu ca</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {formatCurrency(currentShift.totalRevenue + currentShift.startingCash)}
              </p>
              <p className="text-sm text-muted-foreground">Tiền cuối ca (dự kiến)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử ca làm việc</CardTitle>
          <CardDescription>Các ca đã chốt gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Giao dịch</TableHead>
                <TableHead className="text-right">Doanh thu</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shiftHistory.map((shift, index) => (
                <TableRow
                  key={shift.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">{shift.employee}</TableCell>
                  <TableCell>{shift.date}</TableCell>
                  <TableCell>
                    {shift.start} - {shift.end}
                  </TableCell>
                  <TableCell className="text-right">{shift.transactions}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatCurrency(shift.revenue)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted">
                      Đã chốt
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
