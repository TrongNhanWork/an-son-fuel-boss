import { Save, Building2, Bell, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình và thiết lập cho cây xăng
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Thông tin doanh nghiệp</CardTitle>
                <CardDescription>Cập nhật thông tin cây xăng</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="businessName">Tên cây xăng</Label>
              <Input id="businessName" defaultValue="Cây xăng An Sơn" className="bg-background" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                defaultValue="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" defaultValue="028 1234 5678" className="bg-background" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input id="taxCode" defaultValue="0123456789" className="bg-background" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Thông báo</CardTitle>
                <CardDescription>Cấu hình cảnh báo hệ thống</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cảnh báo tồn kho thấp</p>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo khi bể chứa dưới mức cảnh báo
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo chốt ca</p>
                <p className="text-sm text-muted-foreground">
                  Gửi báo cáo khi nhân viên chốt ca
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cảnh báo trụ bơm</p>
                <p className="text-sm text-muted-foreground">
                  Thông báo khi trụ bơm cần bảo trì
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email báo cáo hàng ngày</p>
                <p className="text-sm text-muted-foreground">
                  Gửi báo cáo doanh thu qua email mỗi ngày
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>Cài đặt bảo mật tài khoản</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xác thực 2 bước</p>
                <p className="text-sm text-muted-foreground">
                  Yêu cầu mã OTP khi đăng nhập
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tự động đăng xuất</p>
                <p className="text-sm text-muted-foreground">
                  Đăng xuất sau 30 phút không hoạt động
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Đổi mật khẩu</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Mật khẩu hiện tại"
                className="bg-background"
              />
              <Input
                type="password"
                placeholder="Mật khẩu mới"
                className="bg-background"
              />
              <Input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className="bg-background"
              />
              <Button variant="outline" className="w-fit">
                Cập nhật mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Hệ thống</CardTitle>
                <CardDescription>Thông tin và sao lưu dữ liệu</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phiên bản</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cập nhật cuối</span>
                <span className="font-medium">17/01/2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dung lượng dữ liệu</span>
                <span className="font-medium">256 MB</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sao lưu tự động</p>
                <p className="text-sm text-muted-foreground">
                  Sao lưu dữ liệu hàng ngày lúc 00:00
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Sao lưu ngay
              </Button>
              <Button variant="outline" className="flex-1">
                Khôi phục dữ liệu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
