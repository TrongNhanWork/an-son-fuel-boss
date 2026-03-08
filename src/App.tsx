import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireRole } from "@/components/auth/RequireRole";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import Imports from "@/pages/Imports";
import Inventory from "@/pages/Inventory";
import Shifts from "@/pages/Shifts";
import Reports from "@/pages/Reports";
import Fuels from "@/pages/Fuels";
import Employees from "@/pages/Employees";
import Accessories from "@/pages/Accessories";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected */}
            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                {/* Home */}
                <Route path="/" element={<Dashboard />} />

                {/* Cashier + Manager */}
                <Route element={<RequireRole allow={["Cashier", "Manager"]} />}>
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/shifts" element={<Shifts />} />
                </Route>

                {/* Warehouse + Manager */}
                <Route element={<RequireRole allow={["Warehouse", "Manager"]} />}>
                  <Route path="/imports" element={<Imports />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/accessories/:category" element={<Accessories />} />
                </Route>

                {/* Manager only */}
                <Route element={<RequireRole allow={["Manager"]} />}>
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/fuels" element={<Fuels />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Optional: trang không đủ quyền */}
                <Route path="/403" element={<div className="p-6">Bạn không có quyền truy cập.</div>} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}