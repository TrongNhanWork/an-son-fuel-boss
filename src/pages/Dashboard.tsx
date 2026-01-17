import { DollarSign, ShoppingCart, Droplets, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TankLevel } from '@/components/dashboard/TankLevel';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ShiftStatus } from '@/components/dashboard/ShiftStatus';
import { PumpStatus } from '@/components/dashboard/PumpStatus';
import {
  dashboardStats,
  currentShift,
  recentTransactions,
  pumps,
  formatCurrency,
  formatNumber,
} from '@/data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan hoạt động kinh doanh hôm nay.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Doanh thu hôm nay"
          value={formatCurrency(dashboardStats.todayRevenue)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Giao dịch"
          value={formatNumber(dashboardStats.todayTransactions)}
          subtitle="giao dịch hôm nay"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Sản lượng bán"
          value={`${formatNumber(dashboardStats.totalFuelSold)} lít`}
          subtitle="tất cả loại nhiên liệu"
          icon={Droplets}
          trend={{ value: 5.7, isPositive: true }}
        />
        <StatCard
          title="Ca đang mở"
          value={formatNumber(dashboardStats.activeShifts)}
          subtitle="nhân viên đang làm việc"
          icon={Clock}
          variant="secondary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Chart and Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          <RecentTransactions transactions={recentTransactions} />
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          {/* Tank Levels */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="mb-6">
              <h3 className="font-semibold">Mức tồn kho bể chứa</h3>
              <p className="text-sm text-muted-foreground">Cập nhật theo thời gian thực</p>
            </div>
            <div className="space-y-6">
              {dashboardStats.tankLevels.map((tank) => (
                <TankLevel
                  key={tank.fuelType}
                  fuelType={tank.fuelType}
                  level={tank.level}
                  maxCapacity={tank.maxCapacity}
                  percentage={tank.percentage}
                />
              ))}
            </div>
          </div>

          {/* Current Shift */}
          <ShiftStatus shift={currentShift} />

          {/* Pump Status */}
          <PumpStatus pumps={pumps} />
        </div>
      </div>
    </div>
  );
}
