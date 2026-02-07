import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Package, Edit2, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { auxProducts as initialProducts, formatCurrency, formatNumber } from '@/data/mockData';
import type { AuxProduct, AuxProductCategory } from '@/types';

const categoryLabels: Record<AuxProductCategory, string> = {
  lubricant: 'Dầu nhờn – Mỡ bôi trơn',
  car_care: 'Nước & dung dịch chăm sóc xe',
  additive: 'Phụ gia & hoá chất tiện ích',
};

const categoryColors: Record<AuxProductCategory, string> = {
  lubricant: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  car_care: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  additive: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

const emptyProduct: Omit<AuxProduct, 'id'> = {
  name: '',
  category: 'lubricant',
  unit: 'chai',
  buyPrice: 0,
  sellPrice: 0,
  stock: 0,
  minStock: 5,
  status: 'active',
  description: '',
};

const categoryFromParam: Record<string, AuxProductCategory> = {
  lubricant: 'lubricant',
  'car-care': 'car_care',
  additive: 'additive',
};

export default function Accessories() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const urlCategory = categoryParam ? categoryFromParam[categoryParam] : undefined;

  const [products, setProducts] = useState<AuxProduct[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AuxProduct | null>(null);
  const [form, setForm] = useState<Omit<AuxProduct, 'id'>>(emptyProduct);

  // Determine effective category: URL param takes priority, then dropdown filter
  const effectiveCategory = urlCategory || (categoryFilter !== 'all' ? categoryFilter : undefined);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !effectiveCategory || p.category === effectiveCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, effectiveCategory]);

  const stats = useMemo(() => {
    const relevantProducts = effectiveCategory
      ? products.filter((p) => p.category === effectiveCategory)
      : products;
    const totalProducts = relevantProducts.length;
    const totalValue = relevantProducts.reduce((s, p) => s + p.sellPrice * p.stock, 0);
    const lowStock = relevantProducts.filter((p) => p.stock <= p.minStock && p.status === 'active').length;
    const activeProducts = relevantProducts.filter((p) => p.status === 'active').length;
    return { totalProducts, totalValue, lowStock, activeProducts };
  }, [products, effectiveCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({ ...emptyProduct, category: urlCategory || 'lubricant' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: AuxProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      unit: product.unit,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
      minStock: product.minStock,
      status: product.status,
      description: product.description,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...form } : p))
      );
    } else {
      const newProduct: AuxProduct = {
        id: `aux-${Date.now()}`,
        ...form,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {urlCategory ? categoryLabels[urlCategory] : 'Hàng phụ trợ'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {urlCategory
              ? `Quản lý sản phẩm danh mục ${categoryLabels[urlCategory].toLowerCase()}`
              : 'Quản lý dầu nhờn, nước chăm sóc xe, phụ gia & hoá chất'}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd}>
              <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? 'Cập nhật thông tin sản phẩm phụ trợ'
                  : 'Nhập thông tin sản phẩm phụ trợ mới'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tên sản phẩm</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Nhớt xe máy Castrol 4T 0.8L"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Danh mục</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v as AuxProductCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lubricant">Dầu nhờn – Mỡ bôi trơn</SelectItem>
                      <SelectItem value="car_care">Nước & dung dịch chăm sóc</SelectItem>
                      <SelectItem value="additive">Phụ gia & hoá chất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Đơn vị</Label>
                  <Select
                    value={form.unit}
                    onValueChange={(v) => setForm({ ...form, unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chai">Chai</SelectItem>
                      <SelectItem value="hũ">Hũ</SelectItem>
                      <SelectItem value="tuýp">Tuýp</SelectItem>
                      <SelectItem value="can">Can</SelectItem>
                      <SelectItem value="bình">Bình</SelectItem>
                      <SelectItem value="lọ">Lọ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Giá nhập (VNĐ)</Label>
                  <Input
                    type="number"
                    value={form.buyPrice}
                    onChange={(e) => setForm({ ...form, buyPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Giá bán (VNĐ)</Label>
                  <Input
                    type="number"
                    value={form.sellPrice}
                    onChange={(e) => setForm({ ...form, sellPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tồn kho</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tồn kho tối thiểu</Label>
                  <Input
                    type="number"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={!form.name.trim()}>
                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Tổng sản phẩm', value: stats.totalProducts, icon: Package },
          { label: 'Đang kinh doanh', value: stats.activeProducts, icon: Package },
          { label: 'Giá trị tồn kho', value: formatCurrency(stats.totalValue), icon: Package },
          { label: 'Sắp hết hàng', value: stats.lowStock, icon: Package },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filter + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Danh sách sản phẩm phụ trợ</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm sản phẩm..."
                  className="pl-9 w-[200px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {!urlCategory && (
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="lubricant">Dầu nhờn – Mỡ bôi trơn</SelectItem>
                    <SelectItem value="car_care">Nước & dung dịch chăm sóc</SelectItem>
                    <SelectItem value="additive">Phụ gia & hoá chất</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead className="text-right">Giá nhập</TableHead>
                  <TableHead className="text-right">Giá bán</TableHead>
                  <TableHead className="text-center">Tồn kho</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Không tìm thấy sản phẩm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryColors[product.category]}>
                          {categoryLabels[product.category]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(product.buyPrice)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(product.sellPrice)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={
                            product.stock <= product.minStock
                              ? 'font-semibold text-destructive'
                              : 'text-foreground'
                          }
                        >
                          {formatNumber(product.stock)} {product.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
