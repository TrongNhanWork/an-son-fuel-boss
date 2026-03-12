import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type Alert = {
  tank: string;
  percent: number;
  status: string;
  message: string;
};

export default function TankAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();

    const interval = setInterval(loadAlerts, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadAlerts() {
    try {
      const data = await apiGet<Alert[]>("/api/tanks/alerts");
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="p-3 text-sm text-muted-foreground">
        Không có cảnh báo
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {alerts.map((a) => (
        <div
          key={a.tank}
          className={`p-3 rounded text-white ${
            a.status === "CRITICAL"
              ? "bg-red-600"
              : "bg-yellow-500"
          }`}
        >
          ⚠ {a.message}
        </div>
      ))}
    </div>
  );
}