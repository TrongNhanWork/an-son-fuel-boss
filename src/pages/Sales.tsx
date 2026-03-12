import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* =========================
   TYPES
========================= */

type FuelDto = {
  id: number;
  name: string;
  unitPrice: number;
  active: boolean;
};

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

type AccessoryProductDto = {
  id: number;
  name: string;
  sellPrice: number;
  stock: number;
};

export default function Sales() {
  const [pumps, setPumps] = useState<PumpDto[]>([]);
  const [tanks, setTanks] = useState<TankDto[]>([]);
  const [accessories, setAccessories] = useState<AccessoryProductDto[]>([]);

  const [pumpId, setPumpId] = useState<number | "">("");
  const [liters, setLiters] = useState<number | "">("");

  const [productId, setProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [lastSale, setLastSale] = useState<SaleDto | null>(null);

  async function loadBase() {
    const [p, t, a] = await Promise.all([
      apiGet<PumpDto[]>("/api/pumps"),
      apiGet<TankDto[]>("/api/tanks"),

      // 🔥 SỬA Ở ĐÂY
      apiGet<AccessoryProductDto[]>("/api/accessories"),
    ]);

    setPumps(p);
    setTanks(t);
    setAccessories(a);
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
    const unit = Number(selectedPump?.fuel?.unitPrice ?? 0);
    const lit = Number(liters || 0);
    const total = unit * lit;

    return { unit, total };
  }, [selectedPump, liters]);

  /* =========================
     SELL FUEL
  ========================= */

  async function onSell() {
    try {
      setErr(null);
      setMsg(null);

      if (!pumpId) {
        setErr("Chọn trụ bơm trước.");
        return;
      }

      const lit = Number(liters);

      if (!lit || lit <= 0) {
        setErr("Số lít phải > 0.");
        return;
      }

      if (selectedTank && lit > selectedTank.currentLit) {
        setErr("Không đủ xăng trong bồn.");
        return;
      }

      setLoading(true);

      const sale = await apiPost<SaleDto>("/api/sales", {
        pumpId,
        liters: lit,
      });

      setLastSale(sale);
      setMsg(`Bán xăng thành công: ${sale.code}`);

      const t = await apiGet<TankDto[]>("/api/tanks");
      setTanks(t);

      setLiters("");
    } catch (e: any) {
      setErr(e?.message ?? "Sell failed");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     SELL ACCESSORY
  ========================= */

  async function onSellAccessory() {
    try {
      setErr(null);
      setMsg(null);

      if (!productId) {
        setErr("Chọn sản phẩm phụ trợ.");
        return;
      }

      const qty = Number(quantity);

      if (!qty || qty <= 0) {
        setErr("Số lượng phải > 0.");
        return;
      }

      await apiPost("/api/accessory-sales", {
        productId,
        quantity: qty,
      });

      setMsg("Bán sản phẩm phụ trợ thành công");

      // 🔥 SỬA Ở ĐÂY
      const a = await apiGet<AccessoryProductDto[]>("/api/accessories");
      setAccessories(a);

      setQuantity("");
    } catch (e: any) {
      setErr(e?.message ?? "Accessory sell failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bán hàng</h1>
        <p className="text-muted-foreground">
          Bán xăng hoặc sản phẩm phụ trợ.
        </p>
      </div>

      {err && <div className="border p-3 text-red-500">{err}</div>}
      {msg && <div className="border p-3 text-green-600">{msg}</div>}

      {/* =========================
          BÁN XĂNG
      ========================= */}

      <div className="rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold">Bán xăng</h3>

        <select
          className="w-full border p-2 rounded"
          value={pumpId}
          onChange={(e) =>
            setPumpId(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">-- Chọn trụ --</option>

          {pumps.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} • {p.fuel?.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={liters}
          placeholder="Nhập số lít"
          onChange={(e) =>
            setLiters(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="border p-3">
            <div className="text-xs">Đơn giá</div>
            <div>{formatCurrency(preview.unit)}</div>
          </div>

          <div className="border p-3">
            <div className="text-xs">Thành tiền</div>
            <div>{formatCurrency(preview.total)}</div>
          </div>

          <div className="border p-3">
            <div className="text-xs">Tồn bồn</div>
            <div>
              {selectedTank
                ? `${formatNumber(selectedTank.currentLit)} lít`
                : "—"}
            </div>
          </div>
        </div>

        <Button onClick={onSell} disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo giao dịch"}
        </Button>
      </div>

      {/* =========================
          BÁN PHỤ TRỢ
      ========================= */}

      <div className="rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold">Bán sản phẩm phụ trợ</h3>

        <select
          className="w-full border p-2 rounded"
          value={productId}
          onChange={(e) =>
            setProductId(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">-- Chọn sản phẩm --</option>

          {accessories.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} • {formatCurrency(p.sellPrice)} • tồn {p.stock}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={quantity}
          placeholder="Nhập số lượng"
          onChange={(e) =>
            setQuantity(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <Button onClick={onSellAccessory}>
          Tạo giao dịch
        </Button>
      </div>

      {lastSale && (
        <div className="border p-4">
          <h3 className="font-semibold">Kết quả giao dịch</h3>

          <div>Mã: {lastSale.code}</div>
          <div>Số lít: {lastSale.liters}</div>
          <div>Đơn giá: {formatCurrency(lastSale.unitPrice)}</div>
          <div>Tổng: {formatCurrency(lastSale.totalAmount)}</div>
        </div>
      )}
    </div>
  );
}