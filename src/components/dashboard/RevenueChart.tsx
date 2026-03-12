import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { apiGet } from "@/lib/api";

type WeeklyFuelRow = {
  date: string;
  ron95: number;
  e5: number;
  do: number;
};

export function RevenueChart() {

  const [data, setData] = useState<WeeklyFuelRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState<"thisWeek" | "lastWeek" | "thisMonth">("thisWeek");

  useEffect(() => {

    let mounted = true;

    async function load() {

      try {

        setLoading(true);

        const res = await apiGet<WeeklyFuelRow[]>(
          `/api/reports/weekly-fuel?period=${range}`
        );

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

  }, [range]);

  const chartData = useMemo(() => data ?? [], [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {

    if (active && payload && payload.length) {

      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>

          {payload.map((entry: any, index: number) => (

            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} lít
            </p>

          ))}

        </div>
      );
    }

    return null;

  };

  return (

    <div className="rounded-xl border bg-card p-6 shadow-card">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h3 className="font-semibold">Sản lượng bán</h3>
          <p className="text-sm text-muted-foreground">
            Theo từng loại nhiên liệu
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as any)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="thisWeek">Tuần này</option>
          <option value="lastWeek">Tuần trước</option>
          <option value="thisMonth">Tháng này</option>
        </select>

      </div>

      {loading ? (

        <div className="text-sm text-muted-foreground">
          Đang tải...
        </div>

      ) : (

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={chartData} barGap={2}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend />

            <Bar
              dataKey="ron95"
              name="RON 95"
              fill="#2563eb"
              radius={[4,4,0,0]}
            />

            <Bar
              dataKey="e5"
              name="E5"
              fill="#16a34a"
              radius={[4,4,0,0]}
            />

            <Bar
              dataKey="do"
              name="DO"
              fill="#f59e0b"
              radius={[4,4,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      )}

    </div>

  );
}