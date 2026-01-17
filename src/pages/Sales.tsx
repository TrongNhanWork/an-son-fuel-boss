import { useState } from 'react';
import { Plus, Search, Filter, Download, CreditCard, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { recentTransactions, pumps, fuels, formatCurrency } from '@/data/mockData';
import { FuelType } from '@/types';

const fuelBadgeStyles: Record<FuelType, string> = {
  RON95: 'bg-primary/10 text-primary border-primary/20',
  E5: 'bg-success/10 text-success border-success/20',
  DO: 'bg-secondary/10 text-secondary border-secondary/20',
};

export default function Sales() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPump, setSelectedPump] = useState('');
  const [quantity, setQuantity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPumpCode = (pumpId: string) => {
    return pumps.find((p) => p.id === pumpId)?.code || pumpId;
  };

  const selectedPumpData = pumps.find((p) => p.id === selectedPump);
  const selectedFuel = fuels.find((f) => f.type === selectedPumpData?.fuelType);
  const totalAmount = selectedFuel && quantity ? selectedFuel.price * parseFloat(quantity) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý bán hàng</h1>
          <p className="text-muted-foreground">
            Theo dõi và ghi nhận giao dịch bán nhiên liệu
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Giao dịch mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card">
            <DialogHeader>
              <DialogTitle>Tạo giao dịch mới</DialogTitle>
              <DialogDescription>
                Ghi nhận giao dịch bán nhiên liệu từ trụ bơm
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pump">Trụ bơm</Label>
                <Select value={selectedPump} onValueChange={setSelectedPump}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Chọn trụ bơm" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {pumps
                      .filter((p) => p.status === 'active')
                      .map((pump) => (
                        <SelectItem key={pump.id} value={pump.id}>
                          {pump.code} - {pump.fuelType}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPumpData && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Loại nhiên liệu</span>
                    <Badge className={cn(fuelBadgeStyles[selectedPumpData.fuelType])}>
                      {selectedPumpData.fuelType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Đơn giá</span>
                    <span className="font-semibold">{formatCurrency(selectedFuel?.price || 0)}/lít</span>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="quantity">Số lượng (lít)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Nhập số lít"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="grid gap-2">
                <Label>Phương thức thanh toán</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className="gap-2"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <Banknote className="h-4 w-4" />
                    Tiền mặt
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                    className="gap-2"
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <CreditCard className="h-4 w-4" />
                    Chuyển khoản
                  </Button>
                </div>
              </div>

              {totalAmount > 0 && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Thành tiền</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Xác nhận giao dịch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm giao dịch..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Loại nhiên liệu" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="RON95">RON 95</SelectItem>
            <SelectItem value="E5">E5</SelectItem>
            <SelectItem value="DO">Dầu DO</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="cash">Tiền mặt</SelectItem>
            <SelectItem value="transfer">Chuyển khoản</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Lọc
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trụ bơm</TableHead>
              <TableHead>Nhiên liệu</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction, index) => (
              <TableRow
                key={transaction.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium">
                  {formatDateTime(transaction.timestamp)}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{getPumpCode(transaction.pumpId)}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(fuelBadgeStyles[transaction.fuelType])}
                  >
                    {transaction.fuelType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {transaction.quantity} lít
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {formatCurrency(transaction.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      transaction.paymentMethod === 'cash'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    )}
                  >
                    {transaction.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
