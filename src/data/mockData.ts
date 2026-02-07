import { Fuel, StorageTank, Pump, Transaction, Shift, Employee, ImportRecord, DashboardStats, AuxProduct } from '@/types';

export const fuels: Fuel[] = [
  { id: '1', name: 'Xăng RON 95-III', type: 'RON95', price: 23650, unit: 'lít', status: 'active', color: 'primary' },
  { id: '2', name: 'Xăng E5 RON 92-II', type: 'E5', price: 22550, unit: 'lít', status: 'active', color: 'success' },
  { id: '3', name: 'Dầu Diesel 0.05S-II', type: 'DO', price: 21350, unit: 'lít', status: 'active', color: 'secondary' },
];

export const storageTanks: StorageTank[] = [
  { id: '1', code: 'BE-01', fuelType: 'RON95', maxCapacity: 20000, currentLevel: 15500, warningLevel: 5000, status: 'normal' },
  { id: '2', code: 'BE-02', fuelType: 'E5', maxCapacity: 25000, currentLevel: 8200, warningLevel: 6000, status: 'warning' },
  { id: '3', code: 'BE-03', fuelType: 'DO', maxCapacity: 15000, currentLevel: 12800, warningLevel: 4000, status: 'normal' },
];

export const pumps: Pump[] = [
  { id: '1', code: 'TRU-01', fuelType: 'RON95', status: 'active', tankId: '1' },
  { id: '2', code: 'TRU-02', fuelType: 'RON95', status: 'active', tankId: '1' },
  { id: '3', code: 'TRU-03', fuelType: 'E5', status: 'active', tankId: '2' },
  { id: '4', code: 'TRU-04', fuelType: 'E5', status: 'maintenance', tankId: '2' },
  { id: '5', code: 'TRU-05', fuelType: 'DO', status: 'active', tankId: '3' },
  { id: '6', code: 'TRU-06', fuelType: 'DO', status: 'active', tankId: '3' },
];

export const employees: Employee[] = [
  { id: '1', name: 'Nguyễn Văn An', email: 'an.nguyen@anson.vn', role: 'manager', status: 'active' },
  { id: '2', name: 'Trần Thị Bình', email: 'binh.tran@anson.vn', role: 'cashier', status: 'active' },
  { id: '3', name: 'Lê Văn Cường', email: 'cuong.le@anson.vn', role: 'cashier', status: 'active' },
  { id: '4', name: 'Phạm Thị Dung', email: 'dung.pham@anson.vn', role: 'warehouse', status: 'active' },
];

export const currentShift: Shift = {
  id: 'shift-001',
  employeeId: '2',
  employeeName: 'Trần Thị Bình',
  startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
  startingCash: 2000000,
  totalTransactions: 47,
  totalQuantity: 1250.5,
  totalRevenue: 28750000,
  status: 'active',
};

export const recentTransactions: Transaction[] = [
  { id: 't1', timestamp: new Date(Date.now() - 5 * 60 * 1000), pumpId: '1', fuelType: 'RON95', quantity: 45.5, unitPrice: 23650, total: 1076075, paymentMethod: 'cash', shiftId: 'shift-001', employeeId: '2' },
  { id: 't2', timestamp: new Date(Date.now() - 12 * 60 * 1000), pumpId: '3', fuelType: 'E5', quantity: 30, unitPrice: 22550, total: 676500, paymentMethod: 'transfer', shiftId: 'shift-001', employeeId: '2' },
  { id: 't3', timestamp: new Date(Date.now() - 18 * 60 * 1000), pumpId: '5', fuelType: 'DO', quantity: 80, unitPrice: 21350, total: 1708000, paymentMethod: 'cash', shiftId: 'shift-001', employeeId: '2' },
  { id: 't4', timestamp: new Date(Date.now() - 25 * 60 * 1000), pumpId: '2', fuelType: 'RON95', quantity: 50, unitPrice: 23650, total: 1182500, paymentMethod: 'cash', shiftId: 'shift-001', employeeId: '2' },
  { id: 't5', timestamp: new Date(Date.now() - 35 * 60 * 1000), pumpId: '6', fuelType: 'DO', quantity: 120, unitPrice: 21350, total: 2562000, paymentMethod: 'transfer', shiftId: 'shift-001', employeeId: '2' },
];

export const recentImports: ImportRecord[] = [
  { id: 'i1', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), fuelType: 'RON95', quantity: 10000, unitPrice: 21500, total: 215000000, supplier: 'Petrolimex', tankId: '1', employeeId: '4' },
  { id: 'i2', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), fuelType: 'E5', quantity: 12000, unitPrice: 20500, total: 246000000, supplier: 'PV Oil', tankId: '2', employeeId: '4' },
  { id: 'i3', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), fuelType: 'DO', quantity: 8000, unitPrice: 19800, total: 158400000, supplier: 'Petrolimex', tankId: '3', employeeId: '4' },
];

export const dashboardStats: DashboardStats = {
  todayRevenue: 156850000,
  todayTransactions: 312,
  totalFuelSold: 6520,
  activeShifts: 2,
  tankLevels: [
    { fuelType: 'RON95', level: 15500, maxCapacity: 20000, percentage: 77.5 },
    { fuelType: 'E5', level: 8200, maxCapacity: 25000, percentage: 32.8 },
    { fuelType: 'DO', level: 12800, maxCapacity: 15000, percentage: 85.3 },
  ],
};

export const auxProducts: AuxProduct[] = [
  // Dầu nhờn – Mỡ bôi trơn
  { id: 'aux-1', name: 'Nhớt xe máy Castrol 4T 0.8L', category: 'lubricant', unit: 'chai', buyPrice: 55000, sellPrice: 75000, stock: 48, minStock: 10, status: 'active', description: 'Nhớt xe máy 4 thì, SAE 20W-40' },
  { id: 'aux-2', name: 'Nhớt xe ga Castrol Scooter 0.8L', category: 'lubricant', unit: 'chai', buyPrice: 62000, sellPrice: 85000, stock: 30, minStock: 10, status: 'active', description: 'Chuyên dụng cho xe tay ga' },
  { id: 'aux-3', name: 'Nhớt hộp số xe máy Shell Advance', category: 'lubricant', unit: 'chai', buyPrice: 35000, sellPrice: 50000, stock: 20, minStock: 5, status: 'active' },
  { id: 'aux-4', name: 'Nhớt ô tô Mobil Super 4L', category: 'lubricant', unit: 'can', buyPrice: 380000, sellPrice: 480000, stock: 12, minStock: 5, status: 'active', description: 'SAE 5W-30, phù hợp xe đời mới' },
  { id: 'aux-5', name: 'Dầu phanh DOT 3 Prestone 300ml', category: 'lubricant', unit: 'chai', buyPrice: 42000, sellPrice: 60000, stock: 15, minStock: 5, status: 'active' },
  { id: 'aux-6', name: 'Mỡ bò bôi trơn SKF 500g', category: 'lubricant', unit: 'hũ', buyPrice: 75000, sellPrice: 110000, stock: 8, minStock: 3, status: 'active' },
  { id: 'aux-7', name: 'Xịt bôi trơn sên Motul C2 400ml', category: 'lubricant', unit: 'chai', buyPrice: 95000, sellPrice: 135000, stock: 10, minStock: 5, status: 'active' },
  { id: 'aux-8', name: 'Dung dịch vệ sinh kim phun 3M', category: 'lubricant', unit: 'chai', buyPrice: 120000, sellPrice: 165000, stock: 6, minStock: 3, status: 'active' },
  // Nước & dung dịch chăm sóc xe
  { id: 'aux-9', name: 'Nước rửa kính Sonax 1L', category: 'car_care', unit: 'chai', buyPrice: 55000, sellPrice: 78000, stock: 25, minStock: 8, status: 'active' },
  { id: 'aux-10', name: 'Nước làm mát Coolant Prestone 1L', category: 'car_care', unit: 'chai', buyPrice: 85000, sellPrice: 120000, stock: 18, minStock: 5, status: 'active' },
  { id: 'aux-11', name: 'Dung dịch rửa xe Karcher 1L', category: 'car_care', unit: 'chai', buyPrice: 95000, sellPrice: 140000, stock: 14, minStock: 5, status: 'active' },
  { id: 'aux-12', name: 'Dung dịch vệ sinh nội thất 3M', category: 'car_care', unit: 'chai', buyPrice: 110000, sellPrice: 155000, stock: 10, minStock: 3, status: 'active' },
  { id: 'aux-13', name: 'Chất tẩy nhựa đường Sonax', category: 'car_care', unit: 'chai', buyPrice: 130000, sellPrice: 180000, stock: 7, minStock: 3, status: 'active' },
  // Phụ gia & hoá chất tiện ích
  { id: 'aux-14', name: 'Phụ gia xăng STP Octane Booster', category: 'additive', unit: 'chai', buyPrice: 85000, sellPrice: 120000, stock: 12, minStock: 5, status: 'active' },
  { id: 'aux-15', name: 'Xịt chống rỉ WD-40 333ml', category: 'additive', unit: 'chai', buyPrice: 90000, sellPrice: 130000, stock: 20, minStock: 5, status: 'active' },
  { id: 'aux-16', name: 'Keo vá lốp nhanh Slime 473ml', category: 'additive', unit: 'chai', buyPrice: 150000, sellPrice: 210000, stock: 8, minStock: 3, status: 'active' },
  { id: 'aux-17', name: 'Chai bơm vá nhanh Tire Sealant', category: 'additive', unit: 'chai', buyPrice: 65000, sellPrice: 95000, stock: 15, minStock: 5, status: 'active' },
  { id: 'aux-18', name: 'Dung dịch bịt kín két nước K-Seal', category: 'additive', unit: 'chai', buyPrice: 180000, sellPrice: 250000, stock: 4, minStock: 2, status: 'inactive', description: 'Radiator stop leak' },
];

export const weeklyRevenue = [
  { date: 'T2', revenue: 145000000, ron95: 2100, e5: 1800, do: 1500 },
  { date: 'T3', revenue: 152000000, ron95: 2200, e5: 1900, do: 1600 },
  { date: 'T4', revenue: 138000000, ron95: 2000, e5: 1700, do: 1400 },
  { date: 'T5', revenue: 165000000, ron95: 2400, e5: 2100, do: 1700 },
  { date: 'T6', revenue: 172000000, ron95: 2500, e5: 2200, do: 1800 },
  { date: 'T7', revenue: 189000000, ron95: 2700, e5: 2400, do: 2000 },
  { date: 'CN', revenue: 156850000, ron95: 2450, e5: 2150, do: 1920 },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};
