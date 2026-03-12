import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";

type AccessoryWeekStat = {
  date: string;
  product: string;
  quantity: number;
};

export function AccessoryChart({
  data,
  period,
  setPeriod
}: {
  data: AccessoryWeekStat[];
  period: string;
  setPeriod: (v: string) => void;
}) {

  // Luôn cố định thứ trong tuần
  const days = ["T2","T3","T4","T5","T6","T7","CN"];

  // Lấy danh sách sản phẩm không trùng
  const products = Array.from(new Set(data.map(x => x.product)));

  // Tạo dữ liệu cho chart
  const chartData = days.map(day => {

    const row: any = { day };

    products.forEach(product => {

      const item = data.find(
        x => x.date === day && x.product === product
      );

      row[product] = item ? item.quantity : 0;

    });

    return row;

  });

  // Màu cho các cột
  const colors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#14b8a6",
    "#e11d48"
  ];

  return (

    <div className="rounded-xl border bg-card p-6 shadow-card">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Sản phẩm phụ trợ</h3>
          <p className="text-sm text-muted-foreground">
            Số lượng bán theo từng ngày
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="thisWeek">Tuần này</option>
          <option value="lastWeek">Tuần trước</option>
          <option value="thisMonth">Tháng này</option>
        </select>
      </div>

      <div style={{ width: "100%", height: 300 }}>

        <ResponsiveContainer>

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Legend />

            {products.map((p, i) => (

              <Bar
                key={p}
                dataKey={p}
                fill={colors[i % colors.length]}
                radius={[4,4,0,0]}
              />

            ))}

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}