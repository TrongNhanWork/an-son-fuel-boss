import { useState } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { employees } from '@/data/mockData';

const roleLabels: Record<string, { label: string; color: string }> = {
  manager: { label: 'Quản lý', color: 'bg-primary/10 text-primary border-primary/20' },
  cashier: { label: 'Thu ngân', color: 'bg-success/10 text-success border-success/20' },
  warehouse: { label: 'Kho', color: 'bg-secondary/10 text-secondary border-secondary/20' },
};

export default function Employees() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý nhân viên</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và phân quyền nhân viên
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Thêm nhân viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin nhân viên mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" placeholder="Nhập họ và tên" className="bg-background" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Nhập email" className="bg-background" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="manager">Quản lý</SelectItem>
                    <SelectItem value="cashier">Thu ngân</SelectItem>
                    <SelectItem value="warehouse">Nhân viên kho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="Nhập mật khẩu" className="bg-background" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Thêm nhân viên
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm nhân viên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employee Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee, index) => {
          const role = roleLabels[employee.role];
          const initials = employee.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(-2)
            .toUpperCase();

          return (
            <Card
              key={employee.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      employee.status === 'active'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {employee.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                  </Badge>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <Badge variant="outline" className={cn(role.color)}>
                    {role.label}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê nhân sự</CardTitle>
          <CardDescription>Tổng quan về đội ngũ nhân viên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-3xl font-bold text-primary">{employees.length}</p>
              <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-3xl font-bold">
                {employees.filter((e) => e.role === 'manager').length}
              </p>
              <p className="text-sm text-muted-foreground">Quản lý</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-3xl font-bold">
                {employees.filter((e) => e.role === 'cashier').length}
              </p>
              <p className="text-sm text-muted-foreground">Thu ngân</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-3xl font-bold">
                {employees.filter((e) => e.role === 'warehouse').length}
              </p>
              <p className="text-sm text-muted-foreground">Nhân viên kho</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
