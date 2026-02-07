import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Fuel,
  ShoppingCart,
  Package,
  Clock,
  BarChart3,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Droplets,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { title: 'Tổng quan', href: '/', icon: LayoutDashboard },
  { title: 'Bán hàng', href: '/sales', icon: ShoppingCart },
  { title: 'Nhập kho', href: '/imports', icon: Package },
  { title: 'Tồn kho', href: '/inventory', icon: Droplets },
  { title: 'Ca làm việc', href: '/shifts', icon: Clock },
  { title: 'Báo cáo', href: '/reports', icon: BarChart3 },
  { title: 'Hàng phụ trợ', href: '/accessories', icon: ShoppingBag },
];

const settingsNavItems: NavItem[] = [
  { title: 'Nhiên liệu', href: '/fuels', icon: Fuel },
  { title: 'Nhân viên', href: '/employees', icon: Users },
  { title: 'Cài đặt', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    const linkContent = (
      <NavLink
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
            : 'text-sidebar-foreground/70'
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary-foreground')} />
        {!collapsed && <span className="truncate">{item.title}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {item.badge}
          </span>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Fuel className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">An Sơn</span>
              <span className="text-[10px] text-sidebar-foreground/60">Gas Station</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
            <Fuel className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Quản lý
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>

        <div className="my-4 border-t border-sidebar-border" />

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Cài đặt
            </p>
          )}
          {settingsNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Alert Section */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-lg bg-warning/10 p-3">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Cảnh báo tồn kho</span>
          </div>
          <p className="mt-1 text-[11px] text-sidebar-foreground/70">
            Bể E5 dưới mức cảnh báo
          </p>
        </div>
      )}

      {/* Collapse Button */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2">Thu gọn</span>}
        </Button>
      </div>
    </aside>
  );
}
