import { useState } from 'react';
import { Plus, Search, Download, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
import { recentImports, storageTanks, fuels, formatCurrency, formatNumber } from '@/data/mockData';
import { FuelType } from '@/types';

const fuelBadgeStyles: Record<FuelType, string> = {
  RON95: 'bg-primary/10 text-primary border-primary/20',
  E5: 'bg-success/10 text-success border-success/20',
  DO: 'bg-secondary/10 text-secondary border-secondary/20',
};

export default function Imports() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTank, setSelectedTank] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplier, setSupplier] = useState('');

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTankCode = (tankId: string) => {
    return storageTanks.find((t) => t.id === tankId)?.code || tankId;
  };

  const selectedTankData = storageTanks.find((t) => t.id === selectedTank);
  const selectedFuel = fuels.find((f) => f.type === selectedTankData?.fuelType);
  const totalAmount = quantity && unitPrice ? parseFloat(quantity) * parseFloat(unitPrice) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý nhập kho</h1>
          <p className="text-muted-foreground">
            Ghi nhận và theo dõi phiếu nhập nhiên liệu từ xe bồn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo phiếu nhập
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Tạo phiếu nhập kho
              </DialogTitle>
              <DialogDescription>
                Ghi nhận phiếu nhập nhiên liệu từ xe bồn
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tank">Bể chứa</Label>
                <Select value={selectedTank} onValueChange={setSelectedTank}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Chọn bể chứa" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {storageTanks.map((tank) => (
                      <SelectItem key={tank.id} value={tank.id}>
                        {tank.code} - {tank.fuelType} ({formatNumber(tank.currentLevel)}/{formatNumber(tank.maxCapacity)} lít)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTankData && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Loại nhiên liệu</span>
                    <Badge className={cn(fuelBadgeStyles[selectedTankData.fuelType])}>
                      {selectedFuel?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dung tích còn trống</span>
                    <span className="font-semibold">
                      {formatNumber(selectedTankData.maxCapacity - selectedTankData.currentLevel)} lít
                    </span>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="quantity">Số lượng nhập (lít)</Label>
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
                <Label htmlFor="unitPrice">Đơn giá nhập (VNĐ/lít)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="Nhập đơn giá"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="supplier">Nhà cung cấp</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Chọn nhà cung cấp" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="petrolimex">Petrolimex</SelectItem>
                    <SelectItem value="pvoil">PV Oil</SelectItem>
                    <SelectItem value="saigonpetro">Saigon Petro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {totalAmount > 0 && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tổng giá trị</span>
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
                Xác nhận nhập kho
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
            placeholder="Tìm kiếm phiếu nhập..."
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
            <SelectValue placeholder="Nhà cung cấp" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="petrolimex">Petrolimex</SelectItem>
            <SelectItem value="pvoil">PV Oil</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Imports Table */}
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Bể chứa</TableHead>
              <TableHead>Nhiên liệu</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Tổng giá trị</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentImports.map((record, index) => (
              <TableRow
                key={record.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium">
                  {formatDateTime(record.timestamp)}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{getTankCode(record.tankId)}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(fuelBadgeStyles[record.fuelType])}
                  >
                    {record.fuelType}
                  </Badge>
                </TableCell>
                <TableCell>{record.supplier}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatNumber(record.quantity)} lít
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(record.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {formatCurrency(record.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
