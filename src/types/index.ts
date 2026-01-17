// Fuel Types
export type FuelType = 'RON95' | 'E5' | 'DO';

export interface Fuel {
  id: string;
  name: string;
  type: FuelType;
  price: number;
  unit: string;
  status: 'active' | 'inactive';
  color: string;
}

// Storage Tank
export interface StorageTank {
  id: string;
  code: string;
  fuelType: FuelType;
  maxCapacity: number;
  currentLevel: number;
  warningLevel: number;
  status: 'normal' | 'warning' | 'critical';
}

// Pump
export interface Pump {
  id: string;
  code: string;
  fuelType: FuelType;
  status: 'active' | 'maintenance' | 'inactive';
  tankId: string;
}

// Transaction
export interface Transaction {
  id: string;
  timestamp: Date;
  pumpId: string;
  fuelType: FuelType;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: 'cash' | 'transfer';
  shiftId: string;
  employeeId: string;
}

// Import Record
export interface ImportRecord {
  id: string;
  timestamp: Date;
  fuelType: FuelType;
  quantity: number;
  unitPrice: number;
  total: number;
  supplier: string;
  tankId: string;
  employeeId: string;
}

// Shift
export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: Date;
  endTime?: Date;
  startingCash: number;
  totalTransactions: number;
  totalQuantity: number;
  totalRevenue: number;
  actualCash?: number;
  difference?: number;
  status: 'active' | 'closed';
  notes?: string;
}

// Employee
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'cashier' | 'warehouse';
  status: 'active' | 'inactive';
  avatar?: string;
}

// Dashboard Stats
export interface DashboardStats {
  todayRevenue: number;
  todayTransactions: number;
  totalFuelSold: number;
  activeShifts: number;
  tankLevels: {
    fuelType: FuelType;
    level: number;
    maxCapacity: number;
    percentage: number;
  }[];
}

// Report
export interface RevenueReport {
  date: string;
  revenue: number;
  transactions: number;
  fuelSold: {
    [key in FuelType]: number;
  };
}
