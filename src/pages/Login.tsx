import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [username, setUsername] = useState("manager");
  const [password, setPassword] = useState("123456");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;
  const from = location?.state?.from?.pathname || "/";

  async function onLogin() {
    try {
      setErr(null);
      setLoading(true);
      await auth.login(username, password);
      nav(from, { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-card space-y-4">
        <h1 className="text-xl font-bold">Đăng nhập</h1>
        {err && <div className="text-red-500 text-sm">{err}</div>}

        <div className="space-y-2">
          <label className="text-sm">Username</label>
          <input
            className="w-full rounded-md border bg-background p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded-md border bg-background p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <Button className="w-full" onClick={onLogin} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <div className="text-xs text-muted-foreground">
          Tài khoản seed: manager/cashier/warehouse — mật khẩu: 123456
        </div>
      </div>
    </div>
  );
}