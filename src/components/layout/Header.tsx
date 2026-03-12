import { Bell, Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiGet } from "@/lib/api";
import TankAlerts from "@/components/dashboard/TankAlerts";

export function Header() {
  const nav = useNavigate();
  const { logout, username, fullName, role } = useAuth();

  async function onMe() {
    try {
      const me = await apiGet<{
        id: string;
        username: string;
        fullName: string;
        role: string;
      }>("/api/auth/me");

      alert(`Tài khoản:
- Username: ${me.username}
- Họ tên: ${me.fullName}
- Role: ${me.role}
- Id: ${me.id}`);
    } catch (e: any) {
      alert(e?.message ?? "Không lấy được thông tin cá nhân");
    }
  }

  function onLogout() {
    logout();
    nav("/login", { replace: true });
  }

  const displayName = fullName || username || "User";

  const displayRole =
    role === "Manager"
      ? "Quản lý"
      : role === "Cashier"
      ? "Thu ngân"
      : role === "Warehouse"
      ? "Kho"
      : "";

  const initials =
    (displayName || "U")
      .split(" ")
      .filter(Boolean)
      .slice(-2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="search"
          placeholder="Tìm kiếm giao dịch, nhân viên..."
          className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-input"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Shift status */}
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-sm font-medium text-green-700">
            Ca đang mở
          </span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />

              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                !
              </Badge>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 bg-popover">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Tank Alerts API */}
            <TankAlerts />

          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {displayName}
                </span>

                <span className="text-[10px] text-muted-foreground">
                  {displayRole}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel>
              Tài khoản của tôi
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onMe}>
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}