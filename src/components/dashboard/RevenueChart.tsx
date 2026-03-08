import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiGet } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type WeeklyFuelRow = {
  date: string;   // "T2", "T3"... hoặc "2026-03-02"
  ron95: number;
  e5: number;
  do: number;
};

export function RevenueChart() {
  const [data, setData] = useState<WeeklyFuelRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await apiGet<WeeklyFuelRow[]>("/api/reports/weekly-fuel");
        if (!mounted) return;
        setData(Array.isArray(res) ? res : []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const t = setInterval(load, 10000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  const chartData = useMemo(() => data ?? [], [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {`${entry.value} lít`}
            </p>
          ))}
          <p className="mt-2 text-xs text-muted-foreground">
            (Biểu đồ này đang là “sản lượng” theo từng loại nhiên liệu)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h3 className="font-semibold">Sản lượng bán tuần này</h3>
        <p className="text-sm text-muted-foreground">Theo từng loại nhiên liệu</p>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Đang tải...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
            <YAxis
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} formatter={(value) => <span className="text-sm">{value}</span>} />
            <Bar dataKey="ron95" name="RON 95" fill="hsl(217 91% 40%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="e5" name="E5" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="do" name="DO" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}