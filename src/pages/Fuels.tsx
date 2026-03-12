import { useEffect, useState } from "react";
import { Plus, Edit, History, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { apiGet, apiPut, apiPost, apiDelete } from "@/lib/api";

const fuelCardStyles: Record<string, { bg: string; border: string }> = {
  "RON 95": { bg: "from-primary/10 to-primary/5", border: "border-primary/30" },
  E5: { bg: "from-success/10 to-success/5", border: "border-success/30" },
  DO: { bg: "from-secondary/10 to-secondary/5", border: "border-secondary/30" },
};

export default function Fuels() {
  const [fuels, setFuels] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState("");

  // ADD FUEL STATE
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [fuelName, setFuelName] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");

  async function loadFuels() {
    const data = await apiGet("/api/fuels");
    setFuels(data as any[]);
  }

  async function loadHistory() {
    const data = await apiGet("/api/fuels/price-history");
    setPriceHistory(data as any[]);
  }

  useEffect(() => {
    loadFuels();
    loadHistory();
  }, []);

  async function updatePrice() {
    if (!selectedFuel || !newPrice) return;

    await apiPut(`/api/fuels/${selectedFuel}/price`, parseFloat(newPrice));

    await loadFuels();
    await loadHistory();

    setIsDialogOpen(false);
    setNewPrice("");
    setSelectedFuel(null);
  }

  // ADD FUEL FUNCTION
  async function addFuel() {
    if (!fuelName || !fuelPrice) return;

    await apiPost("/api/fuels", {
      name: fuelName,
      price: Number(fuelPrice),
    });

    setFuelName("");
    setFuelPrice("");
    setIsAddDialogOpen(false);

    await loadFuels();
  }

  const handleDeleteFuel = async (id: number) => {
    const ok = confirm("Bạn có chắc muốn xóa nhiên liệu này?");

    if (!ok) return;

    try {
      await apiDelete(`/api/fuels/${id}`);

      alert("Đã xóa thành công");

      await loadFuels(); // reload danh sách
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý nhiên liệu
          </h1>
          <p className="text-muted-foreground">
            Cấu hình loại nhiên liệu và cập nhật giá bán
          </p>
        </div>

        {/* ADD FUEL BUTTON */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm loại nhiên liệu
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm loại nhiên liệu</DialogTitle>
              <DialogDescription>
                Nhập tên và giá bán ban đầu
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tên nhiên liệu</Label>
                <Input
                  placeholder="Ví dụ: RON97"
                  value={fuelName}
                  onChange={(e) => setFuelName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Giá bán (VNĐ/lít)</Label>
                <Input
                  type="number"
                  placeholder="31000"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Hủy
              </Button>

              <Button onClick={addFuel}>
                Thêm nhiên liệu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* FUEL CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        {fuels.map((fuel, index) => {
          const styles = fuelCardStyles[fuel.name] || fuelCardStyles["RON 95"];

          return (
            <Card
              key={fuel.id}
              className={cn(
                "relative overflow-hidden animate-fade-in",
                styles.border
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br",
                  styles.bg
                )}
              />

              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                      <Fuel className="h-6 w-6 text-foreground" />
                    </div>

                    <div>
                      <CardTitle className="text-lg">{fuel.name}</CardTitle>
                      <CardDescription>{fuel.name}</CardDescription>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      fuel.active
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {fuel.active ? "Đang kinh doanh" : "Ngừng KD"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Giá bán hiện tại
                    </p>

                    <p className="text-3xl font-bold">
                      {formatCurrency(fuel.unitPrice)}
                    </p>

                    <p className="text-xs text-muted-foreground">/lít</p>
                  </div>

                  <Dialog
                    open={isDialogOpen && selectedFuel === fuel.id}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setSelectedFuel(fuel.id);
                    }}
                  >
                    <DialogTrigger asChild>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-3 w-3" />
                          Cập nhật giá
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFuel(fuel.id);
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cập nhật giá bán</DialogTitle>
                        <DialogDescription>
                          Cập nhật giá bán cho {fuel.name}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <Label>Giá mới</Label>

                        <Input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>

                        <Button onClick={updatePrice}>
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

      {/* PRICE HISTORY */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />

            <div>
              <CardTitle>Lịch sử thay đổi giá</CardTitle>
              <CardDescription>
                Theo dõi biến động giá nhiên liệu
              </CardDescription>
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
              {priceHistory.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.changedAt).toLocaleDateString("vi-VN")}
                  </TableCell>

                  <TableCell className="text-right">
                    {record.fuelId === 1 ? formatCurrency(record.newPrice) : "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    {record.fuelId === 2 ? formatCurrency(record.newPrice) : "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    {record.fuelId === 3 ? formatCurrency(record.newPrice) : "-"}
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