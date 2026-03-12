import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Download, Calendar, TrendingUp, Droplets, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { formatCurrency, formatNumber } from '@/lib/utils';
import { apiGet } from '@/lib/api';

const COLORS = ['hsl(217, 91%, 40%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)'];

export default function Reports() {

  const [period, setPeriod] = useState('week');

  const [weeklyFuel, setWeeklyFuel] = useState<any[]>([]);
  const [revenueWeek, setRevenueWeek] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {

    async function load() {

      try {

        const [fuel, revenue, ratio] = await Promise.all([
          apiGet("/api/reports/weekly-fuel"),
          apiGet("/api/reports/revenue-week"),
          apiGet("/api/reports/fuel-ratio"),
        ]);

        setWeeklyFuel(fuel as any[]);
        setRevenueWeek(revenue as any[]);

        const pie = (ratio as any[]).map((r: any) => {

          const map: any = {
            1: "RON 95",
            2: "E5",
            3: "DO",
          };

          return {
            name: map[r.fuelId] ?? "Unknown",
            value: r.liters,
            color: COLORS[r.fuelId - 1],
          };
        });

        setPieData(pie);

      } catch (err) {

        console.error(err);

      }
    }

    load();

  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {

    if (active && payload && payload.length) {

      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg">

          <p className="font-semibold mb-2">{label}</p>

          {payload.map((entry: any, index: number) => (

            <p key={index} className="text-sm" style={{ color: entry.color }}>

              {entry.name}:

              {entry.name.includes('Doanh thu')
                ? formatCurrency(entry.value)
                : `${formatNumber(entry.value)} lít`}

            </p>

          ))}

        </div>
      );
    }

    return null;
  };

  const totalWeeklyRevenue = revenueWeek.reduce(
    (sum: number, d: any) => sum + d.revenue,
    0
  );

  const totalWeeklyQuantity = weeklyFuel.reduce(
    (sum: number, d: any) => sum + d.ron95 + d.e5 + d.do,
    0
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Báo cáo & Thống kê
          </h1>
          <p className="text-muted-foreground">
            Phân tích doanh thu và sản lượng bán hàng
          </p>
        </div>

        <div className="flex gap-3">

          {/* <Select value={period} onValueChange={setPeriod}>

            <SelectTrigger className="w-[180px] bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Chọn kỳ" />
            </SelectTrigger>

            <SelectContent className="bg-popover">
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
            </SelectContent>

          </Select> */}

          {/* <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button> */}

        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 md:grid-cols-3">

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu tuần
            </CardTitle>

            <DollarSign className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold">
              {formatCurrency(totalWeeklyRevenue)}
            </p>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sản lượng
            </CardTitle>

            <Droplets className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold">
              {formatNumber(totalWeeklyQuantity)} lít
            </p>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trung bình/ngày
            </CardTitle>

            <TrendingUp className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <p className="text-2xl font-bold">
              {formatCurrency(totalWeeklyRevenue / 7)}
            </p>

          </CardContent>

        </Card>

      </div>

      {/* CHARTS */}

      <Tabs defaultValue="revenue" className="space-y-4">

        <TabsList>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="quantity">Sản lượng</TabsTrigger>
          <TabsTrigger value="fuel">Theo loại nhiên liệu</TabsTrigger>
        </TabsList>

        {/* REVENUE */}

        <TabsContent value="revenue">

          <Card>

            <CardHeader>

              <CardTitle>Biểu đồ doanh thu</CardTitle>

              <CardDescription>
                Doanh thu theo từng ngày trong tuần
              </CardDescription>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer width="100%" height={400}>

                <LineChart data={revenueWeek}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip content={<CustomTooltip />} />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </TabsContent>

        {/* QUANTITY */}

        <TabsContent value="quantity">

          <Card>

            <CardHeader>

              <CardTitle>Sản lượng bán theo ngày</CardTitle>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer width="100%" height={400}>

                <BarChart data={weeklyFuel}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip content={<CustomTooltip />} />

                  <Legend />

                  <Bar dataKey="ron95" name="RON 95" fill={COLORS[0]} />

                  <Bar dataKey="e5" name="E5" fill={COLORS[1]} />

                  <Bar dataKey="do" name="DO" fill={COLORS[2]} />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </TabsContent>

        {/* PIE */}

        <TabsContent value="fuel">

          <div className="grid gap-4 md:grid-cols-2">

            {/* PIE CHART */}

            <Card>

              <CardHeader>
                <CardTitle>Tỷ lệ sản lượng theo nhiên liệu</CardTitle>
                <CardDescription>Tuần này</CardDescription>
              </CardHeader>

              <CardContent>

                <ResponsiveContainer width="100%" height={300}>

                  <PieChart>

                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={100}
                      label={({ name, percent }: any) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >

                      {pieData.map((entry: any, index: number) => (
                        <Cell key={index} fill={entry.color} />
                      ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </CardContent>

            </Card>


            {/* CHI TIẾT THEO LOẠI NHIÊN LIỆU */}

            <Card>

              <CardHeader>
                <CardTitle>Chi tiết theo loại nhiên liệu</CardTitle>
                <CardDescription>Sản lượng và tỷ lệ</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">

                {pieData.map((fuel: any, index: number) => {

                  const total = pieData.reduce((s: number, f: any) => s + f.value, 0);

                  const percent = ((fuel.value / total) * 100).toFixed(1);

                  return (

                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: fuel.color }}
                        />

                        <span className="font-medium">
                          {fuel.name}
                        </span>

                      </div>

                      <div className="text-right">

                        <div className="font-semibold">
                          {formatNumber(fuel.value)} lít
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {percent}% tổng sản lượng
                        </div>

                      </div>

                    </div>

                  );
                })}

              </CardContent>

            </Card>

          </div>

        </TabsContent>

      </Tabs>

    </div>
  );
}