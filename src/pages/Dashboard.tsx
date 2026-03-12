import { useEffect, useMemo, useState } from "react";
import { DollarSign, ShoppingCart, Droplets, Clock } from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { TankLevel } from "@/components/dashboard/TankLevel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ShiftStatus } from "@/components/dashboard/ShiftStatus";
import { PumpStatus } from "@/components/dashboard/PumpStatus";
import { AccessoryChart } from "@/components/dashboard/AccessoryChart";

import { formatCurrency, formatNumber } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { ShiftDto } from "@/types/shift";
import TankAlerts from "@/components/dashboard/TankAlerts";
/* =========================
   TYPES
========================= */

type FuelDto = {
  id: number;
  name: string;
  unitPrice: number;
  active: boolean;
};

type TankDto = {
  id: number;
  name: string;
  capacityLit: number;
  currentLit: number;
  lowLevelLit: number;
  fuelId: number;
  fuel: FuelDto;
};

type DashboardToday = {
  revenueToday: number;
  transactionsToday: number;
  litersToday: number;
  openShifts: number;
  tanks: TankDto[];

  revenuePercent: number;
  transactionPercent: number;
  litersPercent: number;
};

type PumpDto = {
  id: number;
  code: string;
  active: boolean;
  fuelId: number;
  tankId?: number | null;
  fuel?: FuelDto | null;
};

type AccessoryWeekStat = {
  date: string;
  product: string;
  quantity: number;
};

type RevenueWeek = {
  date: string;
  revenue: number;
  transactions: number;
};

type LitersWeek = {
  date: string;
  liters: number;
};

/* =========================
   MAP FUEL TYPE
========================= */

const fuelKeyById: Record<number, "RON95" | "E5" | "DO"> = {
  1: "RON95",
  2: "E5",
  3: "DO",
};

/* =========================
   DASHBOARD
========================= */

export default function Dashboard() {

  const [dash, setDash] = useState<DashboardToday | null>(null);
  const [shift, setShift] = useState<ShiftDto | null>(null);
  const [pumps, setPumps] = useState<PumpDto[]>([]);

  const [accessoryWeek, setAccessoryWeek] = useState<AccessoryWeekStat[]>([]);
  const [revenueWeek, setRevenueWeek] = useState<RevenueWeek[]>([]);
  const [litersWeek, setLitersWeek] = useState<LitersWeek[]>([]);

  const [period, setPeriod] = useState("thisWeek");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    let mounted = true;

    async function load() {

      try {

        setError(null);

        const [d, s, p, a, r, l] = await Promise.all([
          apiGet<DashboardToday>("/api/dashboard/today"),
          apiGet<ShiftDto | null>("/api/shifts/current"),
          apiGet<PumpDto[]>("/api/pumps"),

          apiGet<AccessoryWeekStat[]>(
            `/api/reports/accessories-week?period=${period}`
          ),

          apiGet<RevenueWeek[]>(
            `/api/reports/revenue-week?period=${period}`
          ),

          apiGet<LitersWeek[]>(
            `/api/reports/liters-week?period=${period}`
          ),
        ]);

        if (!mounted) return;

        setDash(d);
        setShift(s);
        setPumps(p);

        setAccessoryWeek(a);
        setRevenueWeek(r);
        setLitersWeek(l);

      } catch (e: any) {

        if (!mounted) return;

        setError(e?.message ?? "Load failed");
      }
    }

    load();

    const t = setInterval(load, 5000);

    return () => {
      mounted = false;
      clearInterval(t);
    };

  }, [period]);

  const tankLevels = useMemo(() => {

    if (!dash) return [];

    return dash.tanks.map((t) => ({
      key: `tank-${t.id}`,
      fuelType: fuelKeyById[t.fuelId] ?? "RON95",
      level: t.currentLit,
      maxCapacity: t.capacityLit,
      percentage:
        t.capacityLit > 0
          ? Math.round((t.currentLit / t.capacityLit) * 1000) / 10
          : 0,
    }));

  }, [dash]);

  if (error)
    return <div className="p-4 text-red-500">Lỗi tải dữ liệu: {error}</div>;

  if (!dash)
    return <div className="p-4">Đang tải...</div>;

  return (

    <div className="space-y-6">



      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là tổng quan hoạt động kinh doanh.
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

      {/* STAT CARDS */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(dash.revenueToday)}
          icon={DollarSign}
          trend={{
            value: dash.revenuePercent,
            isPositive: dash.revenuePercent >= 0,
          }}
          variant="primary"
        />

        <StatCard
          title="Giao dịch"
          value={formatNumber(dash.transactionsToday)}
          subtitle="giao dịch hôm nay"
          icon={ShoppingCart}
          trend={{
            value: dash.transactionPercent,
            isPositive: dash.transactionPercent >= 0,
          }}
        />

        <StatCard
          title="Sản lượng bán"
          value={`${formatNumber(dash.litersToday)} lít`}
          subtitle="tất cả loại nhiên liệu"
          icon={Droplets}
          trend={{
            value: dash.litersPercent,
            isPositive: dash.litersPercent >= 0,
          }}
        />

        <StatCard
          title="Ca đang mở"
          value={formatNumber(dash.openShifts)}
          subtitle="nhân viên đang làm việc"
          icon={Clock}
          variant="secondary"
        />

      </div>

      {/* CHARTS */}

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2 space-y-6">

          <RevenueChart />

          <AccessoryChart
            data={accessoryWeek}
            period={period}
            setPeriod={setPeriod}
          />

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">

          <div className="rounded-xl border bg-card p-6 shadow-card">

            <div className="mb-6">
              <h3 className="font-semibold">Mức tồn kho bể chứa</h3>
              <p className="text-sm text-muted-foreground">
                Cập nhật theo thời gian thực
              </p>
            </div>

            <div className="space-y-6">

              {tankLevels.map((tank) => (

                <TankLevel
                  key={tank.key}
                  fuelType={tank.fuelType}
                  level={tank.level}
                  maxCapacity={tank.maxCapacity}
                  percentage={tank.percentage}
                />

              ))}

            </div>

          </div>

          <ShiftStatus shift={shift} />
          <PumpStatus pumps={pumps} />

        </div>

      </div>

    </div>
  );
}