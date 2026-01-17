import { useState } from 'react';
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
import { weeklyRevenue, formatCurrency, formatNumber } from '@/data/mockData';

const COLORS = ['hsl(217, 91%, 40%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)'];

const pieData = [
  { name: 'RON 95', value: 16350, color: COLORS[0] },
  { name: 'E5', value: 14250, color: COLORS[1] },
  { name: 'DO', value: 11920, color: COLORS[2] },
];

const monthlyData = [
  { month: 'T1', revenue: 4200000000, quantity: 180000 },
  { month: 'T2', revenue: 3800000000, quantity: 165000 },
  { month: 'T3', revenue: 4500000000, quantity: 195000 },
  { month: 'T4', revenue: 4100000000, quantity: 178000 },
  { month: 'T5', revenue: 4700000000, quantity: 205000 },
  { month: 'T6', revenue: 4300000000, quantity: 187000 },
];

export default function Reports() {
  const [period, setPeriod] = useState('week');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Doanh thu') || entry.name.includes('revenue')
                ? formatCurrency(entry.value)
                : `${formatNumber(entry.value)} lít`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalWeeklyRevenue = weeklyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const totalWeeklyQuantity = weeklyRevenue.reduce(
    (sum, day) => sum + day.ron95 + day.e5 + day.do,
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground">
            Phân tích doanh thu và sản lượng bán hàng
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Chọn kỳ" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu tuần
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalWeeklyRevenue)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+12.5%</span> so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sản lượng
            </CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(totalWeeklyQuantity)} lít</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+8.3%</span> so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
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
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(totalWeeklyQuantity / 7)} lít/ngày
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="quantity">Sản lượng</TabsTrigger>
          <TabsTrigger value="fuel">Theo loại nhiên liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu</CardTitle>
              <CardDescription>Doanh thu theo từng ngày trong tuần</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="hsl(217, 91%, 40%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(217, 91%, 40%)', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản lượng bán theo ngày</CardTitle>
              <CardDescription>Phân theo từng loại nhiên liệu</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyRevenue} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="ron95" name="RON 95" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="e5" name="E5" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="do" name="DO" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết theo loại nhiên liệu</CardTitle>
                <CardDescription>Sản lượng và doanh thu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pieData.map((fuel, index) => (
                  <div
                    key={fuel.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: fuel.color }}
                      />
                      <span className="font-medium">{fuel.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNumber(fuel.value)} lít</p>
                      <p className="text-xs text-muted-foreground">
                        {((fuel.value / totalWeeklyQuantity) * 100).toFixed(1)}% tổng sản lượng
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
