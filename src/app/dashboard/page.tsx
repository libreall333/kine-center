"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, XCircle, Users, Activity, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { getDashboardStats, getAppointments } from "@/lib/data/store";
import type { AppointmentDetailed } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function DashboardHome() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);
  const [appts, setAppts] = useState<AppointmentDetailed[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAppointments()]).then(([s, a]) => {
      setStats(s);
      setAppts(a);
    });
  }, []);

  if (!stats) return <LoadingState />;

  const todayAppts = appts.filter((a) => a.date === today && a.status !== "cancelada");
  const upcoming = appts.filter((a) => a.date > today && a.status !== "cancelada").slice(0, 5);

  return (
    <div>
      <PageTitle title="Resumen" subtitle={`Hoy es ${formatDate(today, { weekday: "long", day: "2-digit", month: "long" })}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Citas hoy" value={stats.todayCount} icon={CalendarDays} tone="primary" />
        <StatCard label="Agendadas" value={stats.scheduled} icon={Activity} tone="secondary" />
        <StatCard label="Realizadas" value={stats.done} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Canceladas" value={stats.cancelled} icon={XCircle} tone="rose" />
        <StatCard label="Pacientes" value={stats.patients} icon={Users} tone="primary" />
        <StatCard label="Planes activos" value={stats.activePlans} icon={ClipboardCheck} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Citas de hoy</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {todayAppts.length === 0 && <p className="text-sm text-muted-foreground">No hay citas para hoy.</p>}
            {todayAppts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3">
                <span className="w-14 text-center text-sm font-semibold text-primary">{a.time}</span>
                <Avatar name={a.patient?.full_name ?? "?"} className="h-9 w-9 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.patient?.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.service?.name} · {a.professional?.full_name}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximas citas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Sin próximas citas.</p>}
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="w-16 text-center">
                  <p className="text-xs text-muted-foreground">{formatDate(a.date, { day: "2-digit", month: "short" })}</p>
                  <p className="text-sm font-semibold text-primary">{a.time}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.patient?.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.service?.name}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
