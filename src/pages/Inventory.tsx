import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Droplets,
  ArrowDown,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { formatNumber, formatCurrency } from "@/data/mockData";
import { apiGet, apiPost } from "@/lib/api";

type InventoryItem = {
  id: number;
  tankName: string;
  fuelName: string;
  currentLit: number;
  capacityLit: number;
  lowLevelLit: number;
  inventoryValue: number;
};

type InventoryHistory = {
  id: number;
  tankId: number;
  tankName: string;
  changeType: string;
  quantity: number;
  createdAt: string;
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAdjust, setShowAdjust] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<InventoryHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadInventory = async () => {
    try {
      const res = await apiGet<InventoryItem[]>("/api/inventory");
      setItems(res);
    } catch (err) {
      console.error("Load inventory error:", err);
    }
  };

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await apiGet<InventoryHistory[]>(
        "/api/inventory/history"
      );
      setHistory(res);
    } catch (err) {
      console.error("Load history error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjust = async () => {
    const qty = Number(quantity);

    if (!selectedTankId || qty === 0) {
      alert("Vui lòng chọn bể và nhập số lượng");
      return;
    }

    try {
      setLoading(true);

      await apiPost("/api/inventory/adjust", {
        tankId: selectedTankId,
        quantity: qty,
      });

      await loadInventory();
      setShowAdjust(false);
      setQuantity("");
      setSelectedTankId(0);
    } catch (err) {
      console.error(err);
      alert("Điều chỉnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý tồn kho
          </h1>
          <p className="text-muted-foreground">
            Theo dõi mức tồn kho các bể chứa nhiên liệu
          </p>
        </div>

        <div className="flex gap-3">
          {/* HISTORY DIALOG */}
          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                onClick={loadHistory}
              >
                <History className="h-4 w-4" />
                Lịch sử biến động
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl w-full">
              <DialogHeader>
                <DialogTitle>
                  Lịch sử biến động tồn kho
                </DialogTitle>
              </DialogHeader>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {historyLoading && <p>Đang tải...</p>}

                {!historyLoading && history.length === 0 && (
                  <p className="text-muted-foreground">
                    Chưa có biến động nào
                  </p>
                )}

                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {item.tankName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div
                      className={`font-bold ${
                        item.quantity > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.quantity > 0 ? "+" : ""}
                      {formatNumber(item.quantity)} lít
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* ADJUST BUTTON */}
          <Button
            className="gap-2"
            onClick={() => setShowAdjust(!showAdjust)}
          >
            <ArrowDown className="h-4 w-4" />
            Điều chỉnh tồn kho
          </Button>
        </div>
      </div>

      {/* ADJUST FORM */}
      {showAdjust && (
        <Card>
          <CardHeader>
            <CardTitle>Điều chỉnh tồn kho</CardTitle>
            <CardDescription>
              Nhập số lít (+ để cộng, - để trừ)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3 items-end">
            <select
              className="border rounded px-3 py-2"
              value={selectedTankId}
              onChange={(e) =>
                setSelectedTankId(Number(e.target.value))
              }
            >
              <option value={0}>Chọn bể</option>
              {items.map((tank) => (
                <option key={tank.id} value={tank.id}>
                  {tank.tankName}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border rounded px-3 py-2"
              placeholder="Số lít (+/-)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Button onClick={handleAdjust} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* INVENTORY CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((tank, index) => {
          const percentage =
            tank.capacityLit > 0
              ? (tank.currentLit / tank.capacityLit) * 100
              : 0;

          const isWarning =
            tank.currentLit <= tank.lowLevelLit;
          const isCritical =
            tank.currentLit <= tank.lowLevelLit * 0.5;

          return (
            <Card
              key={tank.id}
              className={cn(
                "relative overflow-hidden animate-fade-in",
                isWarning && "border-warning",
                isCritical && "border-destructive"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isWarning && (
                <div className="absolute top-0 right-0 m-3">
                  <AlertTriangle
                    className={cn(
                      "h-5 w-5",
                      isCritical
                        ? "text-destructive"
                        : "text-warning"
                    )}
                  />
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-primary/10">
                    <Droplets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {tank.tankName}
                    </CardTitle>
                    <CardDescription>
                      {tank.fuelName}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Mức hiện tại
                    </span>
                    <span className="font-bold text-primary">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <Progress value={percentage} />

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatNumber(tank.currentLit)} lít
                    </span>
                    <span>
                      / {formatNumber(tank.capacityLit)} lít
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Mức cảnh báo
                    </p>
                    <p className="text-sm font-medium">
                      {formatNumber(tank.lowLevelLit)} lít
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Giá trị tồn
                    </p>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        tank.inventoryValue
                      )}
                    </p>
                  </div>
                </div>

                {isWarning && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-full justify-center",
                      isCritical
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    )}
                  >
                    {isCritical
                      ? "Cần nhập hàng gấp!"
                      : "Dưới mức cảnh báo"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}