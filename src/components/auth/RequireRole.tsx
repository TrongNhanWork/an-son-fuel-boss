import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Role } from "@/lib/auth";

export function RequireRole({ allow }: { allow: Role[] }) {
  const { isReady, role } = useAuth();
  if (!isReady) return null;

  if (!role || !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}