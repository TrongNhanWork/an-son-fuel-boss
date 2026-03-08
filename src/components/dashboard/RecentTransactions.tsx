import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";

type SaleRecentDto = {
  id: number;
  code: string;
  createdAt: string; // ISO
  liters: number;
  unitPrice: number;
  totalAmount: number;

  pumpId: number;
  pumpCode: string;

  fuelId: number;
  fuelName: string; // "Xăng RON 95", "Xăng E5", "Dầu DO"
};

interface RecentTransactionsProps {
  take?: number;
}

// map theo tên nhiên liệu để ra badge style giống UI cũ
function getFuelKey(name: string): "RON95" | "E5" | "DO" | "OTHER" {
  const n = (name || "").toLowerCase();
  if (n.includes("ron") || n.includes("ron 95") || n.includes("ron95")) return "RON95";
  if (n.includes("e5")) return "E5";
  if (n.includes("do") || n.includes("dầu")) return "DO";
  return "OTHER";
}

const fuelBadgeStyles: Record<ReturnType<typeof getFuelKey>, string> = {
  RON95: "bg-primary/10 text-primary border-primary/20",
  E5: "bg-success/10 text-success border-success/20",
  DO: "bg-secondary/10 text-secondary border-secondary/20",
  OTHER: "bg-muted text-foreground border-muted",
};

export function RecentTransactions({ take = 5 }: RecentTransactionsProps) {
  const [items, setItems] = useState<SaleRecentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setErr(null);
        setLoading(true);
        const data = await apiGet<SaleRecentDto[]>(`/api/sales/recent?take=${take}`);
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message ?? "Load failed");
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const t = setInterval(load, 5000); // refresh nhẹ
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [take]);

  const rows = useMemo(() => {
    return items.map((x) => {
      const dt = new Date(x.createdAt);
      const time = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(dt);
      const fuelKey = getFuelKey(x.fuelName);
      return { ...x, time, fuelKey };
    });
  }, [items]);

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Giao dịch gần đây</h3>
        <a href="/sales" className="text-sm text-primary hover:underline">
          Xem tất cả
        </a>
      </div>

      {loading && <div className="p-4 text-sm text-muted-foreground">Đang tải...</div>}
      {err && <div className="p-4 text-sm text-red-500">Lỗi: {err}</div>}

      {!loading && !err && (
        <div className="divide-y">
          {rows.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">Chưa có giao dịch.</div>
          ) : (
            rows.map((t, index) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", "bg-success/10")}>
                    <ArrowUpRight className="h-5 w-5 text-success" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.pumpCode || `TRỤ-${t.pumpId}`}</span>
                      <Badge variant="outline" className={cn("text-[10px]", fuelBadgeStyles[t.fuelKey])}>
                        {t.fuelName}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {t.time} • {t.liters} lít
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(t.totalAmount)}</p>
                  <p className="text-xs text-muted-foreground">Tiền mặt</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}