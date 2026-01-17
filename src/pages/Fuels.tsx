import { useState } from 'react';
import { Plus, Edit, History, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
import { fuels, formatCurrency } from '@/data/mockData';
import { FuelType } from '@/types';

const fuelCardStyles: Record<FuelType, { bg: string; border: string }> = {
  RON95: { bg: 'from-primary/10 to-primary/5', border: 'border-primary/30' },
  E5: { bg: 'from-success/10 to-success/5', border: 'border-success/30' },
  DO: { bg: 'from-secondary/10 to-secondary/5', border: 'border-secondary/30' },
};

const priceHistory = [
  { date: '15/01/2026', ron95: 23650, e5: 22550, do: 21350 },
  { date: '08/01/2026', ron95: 23450, e5: 22350, do: 21150 },
  { date: '01/01/2026', ron95: 23250, e5: 22150, do: 20950 },
  { date: '25/12/2025', ron95: 23050, e5: 21950, do: 20750 },
];

export default function Fuels() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [newPrice, setNewPrice] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý nhiên liệu</h1>
          <p className="text-muted-foreground">
            Cấu hình loại nhiên liệu và cập nhật giá bán
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm loại nhiên liệu
        </Button>
      </div>

      {/* Fuel Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {fuels.map((fuel, index) => {
          const styles = fuelCardStyles[fuel.type];
          return (
            <Card
              key={fuel.id}
              className={cn(
                'relative overflow-hidden animate-fade-in',
                styles.border
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn('absolute inset-0 bg-gradient-to-br', styles.bg)} />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                      <Fuel className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{fuel.name}</CardTitle>
                      <CardDescription>{fuel.type}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      fuel.status === 'active'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {fuel.status === 'active' ? 'Đang kinh doanh' : 'Ngừng KD'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Giá bán hiện tại</p>
                    <p className="text-3xl font-bold">{formatCurrency(fuel.price)}</p>
                    <p className="text-xs text-muted-foreground">/{fuel.unit}</p>
                  </div>
                  <Dialog open={isDialogOpen && selectedFuel === fuel.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) setSelectedFuel(fuel.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-3 w-3" />
                        Cập nhật giá
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card">
                      <DialogHeader>
                        <DialogTitle>Cập nhật giá bán</DialogTitle>
                        <DialogDescription>
                          Cập nhật giá bán cho {fuel.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Giá hiện tại</span>
                            <span className="font-semibold">{formatCurrency(fuel.price)}</span>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="newPrice">Giá mới (VNĐ/lít)</Label>
                          <Input
                            id="newPrice"
                            type="number"
                            placeholder="Nhập giá mới"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        {newPrice && (
                          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Chênh lệch</span>
                              <span className={cn(
                                'font-semibold',
                                parseFloat(newPrice) > fuel.price ? 'text-destructive' : 'text-success'
                              )}>
                                {parseFloat(newPrice) > fuel.price ? '+' : ''}
                                {formatCurrency(parseFloat(newPrice) - fuel.price)}
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
                          Xác nhận cập nhật
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Price History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Lịch sử thay đổi giá</CardTitle>
              <CardDescription>Theo dõi biến động giá nhiên liệu</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày áp dụng</TableHead>
                <TableHead className="text-right">Xăng RON 95</TableHead>
                <TableHead className="text-right">Xăng E5</TableHead>
                <TableHead className="text-right">Dầu DO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceHistory.map((record, index) => (
                <TableRow
                  key={record.date}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.ron95)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.e5)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.do)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
