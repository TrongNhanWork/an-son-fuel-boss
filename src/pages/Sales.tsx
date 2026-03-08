import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FuelDto = { id: number; name: string; unitPrice: number; active: boolean };

type PumpDto = {
  id: number;
  code: string;
  active: boolean;
  fuelId: number;
  tankId?: number | null;
  fuel?: FuelDto | null;
};

type TankDto = {
  id: number;
  name: string;
  capacityLit: number;
  currentLit: number;
  lowLevelLit: number;
  fuelId: number;
  fuel?: FuelDto | null;
};

type CreateSaleRequest = {
  pumpId: number;
  liters: number;
};

type SaleDto = {
  id: number;
  code: string;
  createdAt: string;
  shiftId: number;
  pumpId: number;
  fuelId: number;
  tankId: number;
  liters: number;
  unitPrice: number;
  totalAmount: number;
};

export default function Sales() {
  const [pumps, setPumps] = useState<PumpDto[]>([]);
  const [tanks, setTanks] = useState<TankDto[]>([]);
  const [pumpId, setPumpId] = useState<number | "">("");
  const [liters, setLiters] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<SaleDto | null>(null);

  async function loadBase() {
    const [p, t] = await Promise.all([
      apiGet<PumpDto[]>("/api/pumps"),
      apiGet<TankDto[]>("/api/tanks"),
    ]);
    setPumps(p);
    setTanks(t);
  }

  useEffect(() => {
    loadBase().catch((e: any) => setErr(e?.message ?? "Load failed"));
  }, []);

  const selectedPump = useMemo(
    () => pumps.find((x) => x.id === pumpId) ?? null,
    [pumps, pumpId]
  );

  const selectedTank = useMemo(() => {
    if (!selectedPump?.tankId) return null;
    return tanks.find((t) => t.id === selectedPump.tankId) ?? null;
  }, [selectedPump, tanks]);

  const preview = useMemo(() => {
    const unit = selectedPump?.fuel?.unitPrice ?? 0;
    const total = unit * (liters || 0);
    return { unit, total };
  }, [selectedPump, liters]);

  async function onSell() {
    try {
      setErr(null);
      setMsg(null);
      setLastSale(null);

      if (!pumpId) {
        setErr("Chọn trụ bơm trước.");
        return;
      }
      if (!liters || liters <= 0) {
        setErr("Số lít phải > 0.");
        return;
      }

      setLoading(true);

      const sale = await apiPost<SaleDto>("/api/sales", {
        pumpId,
        liters,
      } satisfies CreateSaleRequest);

      setLastSale(sale);
      setMsg(`Bán thành công: ${sale.code}`);

      // reload tanks để cập nhật tồn bồn sau khi trừ
      const t = await apiGet<TankDto[]>("/api/tanks");
      setTanks(t);
    } catch (e: any) {
      setErr(e?.message ?? "Sell failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bán hàng</h1>
        <p className="text-muted-foreground">Chọn trụ bơm, nhập số lít và tạo giao dịch.</p>
      </div>

      {err && <div className="rounded-lg border p-3 text-red-500">{err}</div>}
      {msg && <div className="rounded-lg border p-3 text-green-600">{msg}</div>}

      <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
        {/* chọn trụ */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Trụ bơm</label>
          <select
            className="w-full rounded-md border bg-background p-2"
            value={pumpId}
            onChange={(e) => setPumpId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">-- Chọn trụ --</option>
            {pumps.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} • {p.fuel?.name ?? `FuelId=${p.fuelId}`} •{" "}
                {p.active ? "Đang hoạt động" : "Tạm ngưng"}
              </option>
            ))}
          </select>
        </div>

        {/* nhập liters */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Số lít</label>
          <input
            type="number"
            className="w-full rounded-md border bg-background p-2"
            value={liters}
            min={1}
            onChange={(e) => setLiters(Number(e.target.value))}
          />
        </div>

        {/* preview */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Đơn giá</div>
            <div className="font-semibold">{formatCurrency(preview.unit)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Thành tiền</div>
            <div className="font-semibold">{formatCurrency(preview.total)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Tồn bồn hiện tại</div>
            <div className="font-semibold">
              {selectedTank ? `${formatNumber(selectedTank.currentLit)} lít` : "—"}
            </div>
            {selectedTank && (
              <div className="text-xs text-muted-foreground">
                {selectedTank.name} / {formatNumber(selectedTank.capacityLit)} lít
              </div>
            )}
          </div>
        </div>

        <Button onClick={onSell} disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo giao dịch"}
        </Button>
      </div>

      {/* kết quả sale */}
      {lastSale && (
        <div className="rounded-xl border bg-card p-6 shadow-card space-y-2">
          <h3 className="font-semibold">Kết quả giao dịch</h3>
          <div className="text-sm text-muted-foreground">Mã: {lastSale.code}</div>
          <div className="text-sm">Số lít: {lastSale.liters}</div>
          <div className="text-sm">Đơn giá: {formatCurrency(lastSale.unitPrice)}</div>
          <div className="text-sm font-semibold">Tổng: {formatCurrency(lastSale.totalAmount)}</div>
        </div>
      )}
    </div>
  );
}