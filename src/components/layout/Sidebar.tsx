import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  ChevronDown,
  Droplets,
  AlertTriangle,
  ShoppingBag,
  Droplet,
  SprayCan,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Role } from "@/lib/auth";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
  allow?: Role[]; // ✅ thêm
}

const mainNavItems: NavItem[] = [
  { title: "Tổng quan", href: "/", icon: LayoutDashboard, allow: ["Manager", "Cashier", "Warehouse"] },

  // Cashier + Manager
  { title: "Bán hàng", href: "/sales", icon: ShoppingCart, allow: ["Cashier", "Manager"] },
  { title: "Ca làm việc", href: "/shifts", icon: Clock, allow: ["Cashier", "Manager"] },

  // Warehouse + Manager
  { title: "Nhập kho", href: "/imports", icon: Package, allow: ["Warehouse", "Manager"] },
  { title: "Tồn kho", href: "/inventory", icon: Droplets, allow: ["Warehouse", "Manager"] },
  {
    title: "Hàng phụ trợ",
    href: "/accessories",
    icon: ShoppingBag,
    allow: ["Warehouse", "Manager"],
    children: [
      { title: "Dầu nhờn – Mỡ bôi trơn", href: "/accessories/lubricant", icon: Droplet, allow: ["Warehouse", "Manager"] },
      { title: "Nước & dung dịch", href: "/accessories/car-care", icon: SprayCan, allow: ["Warehouse", "Manager"] },
      { title: "Phụ gia & hoá chất", href: "/accessories/additive", icon: FlaskConical, allow: ["Warehouse", "Manager"] },
    ],
  },

  // Manager only
  { title: "Báo cáo", href: "/reports", icon: BarChart3, allow: ["Manager"] },
];

const settingsNavItems: NavItem[] = [
  { title: "Nhiên liệu", href: "/fuels", icon: Fuel, allow: ["Manager"] },
  { title: "Nhân viên", href: "/employees", icon: Users, allow: ["Manager"] },
  { title: "Cài đặt", href: "/settings", icon: Settings, allow: ["Manager"] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role } = useAuth();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "/accessories": location.pathname.startsWith("/accessories"),
  });

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const canSee = (item: NavItem) => {
    if (!item.allow) return true;
    if (!role) return false;
    return item.allow.includes(role);
  };

  const filteredMain = useMemo(() => {
    const filterTree = (items: NavItem[]): NavItem[] =>
      items
        .filter(canSee)
        .map((it) => ({
          ...it,
          children: it.children ? filterTree(it.children) : undefined,
        }))
        .filter((it) => !it.children || it.children.length > 0);
    return filterTree(mainNavItems);
  }, [role]);

  const filteredSettings = useMemo(() => {
    return settingsNavItems.filter(canSee);
  }, [role]);

  const NavItemComponent = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isGroupActive = hasChildren && location.pathname.startsWith(item.href);
    const isOpen = openGroups[item.href] || isGroupActive;
    const Icon = item.icon;

    if (hasChildren) {
      const groupContent = (
        <div>
          <button
            onClick={() => toggleGroup(item.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isGroupActive ? "text-sidebar-primary-foreground bg-sidebar-primary/80" : "text-sidebar-foreground/70"
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", isGroupActive && "text-sidebar-primary-foreground")} />
            {!collapsed && (
              <>
                <span className="truncate flex-1 text-left">{item.title}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
              </>
            )}
          </button>

          {!collapsed && isOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-2">
              {item.children!.map((child) => (
                <NavItemComponent key={child.href} item={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      );

      if (collapsed) {
        return (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{groupContent}</TooltipTrigger>
            <TooltipContent side="right" className="space-y-1">
              <p className="font-medium">{item.title}</p>
              {item.children!.map((child) => (
                <NavLink
                  key={child.href}
                  to={child.href}
                  className={cn("block rounded px-2 py-1 text-xs hover:bg-accent", location.pathname === child.href && "font-semibold text-primary")}
                >
                  {child.title}
                </NavLink>
              ))}
            </TooltipContent>
          </Tooltip>
        );
      }

      return groupContent;
    }

    const linkContent = (
      <NavLink
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          depth > 0 ? "py-2 text-[13px]" : "",
          isActive
            ? depth > 0
              ? "bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-sm"
              : "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
            : "text-sidebar-foreground/70"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", depth > 0 && "h-4 w-4", isActive && "text-sidebar-primary-foreground")} />
        {!collapsed && <span className="truncate">{item.title}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {item.badge}
          </span>
        )}
      </NavLink>
    );

    if (collapsed && depth === 0) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside className={cn("flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300", collapsed ? "w-[72px]" : "w-64")}>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Fuel className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">An Sơn</span>
              <span className="text-[10px] text-sidebar-foreground/60">Gas Station</span>
            </div>
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
            <Fuel className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Quản lý</p>
          )}
          {filteredMain.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>

        <div className="my-4 border-t border-sidebar-border" />

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Cài đặt</p>
          )}
          {filteredSettings.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-lg bg-warning/10 p-3">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Cảnh báo tồn kho</span>
          </div>
          <p className="mt-1 text-[11px] text-sidebar-foreground/70">Bể E5 dưới mức cảnh báo</p>
        </div>
      )}

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