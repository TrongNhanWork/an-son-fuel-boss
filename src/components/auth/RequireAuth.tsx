import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

export function RequireAuth() {
  const { isReady, isAuthed } = useAuth();
  const location = useLocation();

  if (!isReady) return null; // hoặc loading UI
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}