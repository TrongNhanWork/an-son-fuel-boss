import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ShiftDto } from "@/types/shift";

export default function Shifts() {
  const [shift, setShift] = useState<ShiftDto | null>(null);
  const [openingCash, setOpeningCash] = useState<number>(500000);
  const [countedCash, setCountedCash] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const s = await apiGet<ShiftDto | null>("/api/shifts/current");
    setShift(s);
  }

  useEffect(() => {
    load().catch((e: any) => setErr(e?.message ?? "Load failed"));
  }, []);

  async function openShift() {
    try {
      setErr(null);
      setMsg(null);
      setLoading(true);
      const res = await apiPost<ShiftDto>("/api/shifts/open", { openingCash });
      setMsg(`Mở ca thành công: ${res.code}`);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Open shift failed");
    } finally {
      setLoading(false);
    }
  }

  async function closeShift() {
    try {
      setErr(null);
      setMsg(null);
      setLoading(true);
      const res = await apiPost<ShiftDto>("/api/shifts/close", { countedCash });
      setMsg(`Chốt ca thành công: ${res.code}`);
      setShift(res);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Close shift failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ca làm việc</h1>
        <p className="text-muted-foreground">Mở ca và chốt ca.</p>
      </div>

      {err && <div className="rounded-lg border p-3 text-red-500">{err}</div>}
      {msg && <div className="rounded-lg border p-3 text-green-600">{msg}</div>}

      {!shift ? (
        <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
          <h3 className="font-semibold">Hiện chưa có ca đang mở</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tiền đầu ca</label>
            <input
              type="number"
              className="w-full rounded-md border bg-background p-2"
              value={openingCash}
              onChange={(e) => setOpeningCash(Number(e.target.value))}
            />
          </div>

          <Button onClick={openShift} disabled={loading}>
            {loading ? "Đang mở ca..." : "Mở ca"}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
          <h3 className="font-semibold">Ca hiện tại</h3>

          <div className="text-sm text-muted-foreground">Mã ca: {shift.code}</div>
          <div className="text-sm">
            Trạng thái: {shift.status === 0 ? "Đang mở" : "Đã chốt"}
          </div>
          <div className="text-sm">Tiền đầu ca: {formatCurrency(shift.openingCash)}</div>
          <div className="text-sm">
            Doanh thu kỳ vọng (tạm tính): {formatCurrency(shift.expectedCash ?? 0)}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tiền đếm thực tế</label>
            <input
              type="number"
              className="w-full rounded-md border bg-background p-2"
              value={countedCash}
              onChange={(e) => setCountedCash(Number(e.target.value))}
            />
          </div>

          <Button onClick={closeShift} disabled={loading} variant="outline">
            {loading ? "Đang chốt ca..." : "Chốt ca"}
          </Button>
        </div>
      )}
    </div>
  );
}