"use client";

import { useEffect, useState } from "react";
import { Check, X, CalendarClock } from "lucide-react";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { LoadingState } from "@/components/ui/spinner";
import { getAppointments, updateAppointmentStatus } from "@/lib/data/store";
import type { AppointmentDetailed, AppointmentStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const filters: { key: AppointmentStatus | "todas"; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "confirmada", label: "Confirmadas" },
  { key: "realizada", label: "Realizadas" },
  { key: "cancelada", label: "Canceladas" },
];

export default function CitasPage() {
  const [appts, setAppts] = useState<AppointmentDetailed[] | null>(null);
  const [filter, setFilter] = useState<AppointmentStatus | "todas">("todas");

  const load = () => getAppointments().then(setAppts);
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: AppointmentStatus) {
    await updateAppointmentStatus(id, status);
    load();
  }

  if (!appts) return <LoadingState />;
  const list = filter === "todas" ? appts : appts.filter((a) => a.status === filter);

  return (
    <div>
      <PageTitle title="Citas" subtitle="Gestiona el estado de las reservas" />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === f.key ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No hay citas en esta categoría.</p>
          ) : (
            <div className="divide-y">
              {list.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="flex w-24 flex-col items-center justify-center rounded-lg bg-muted/60 py-2">
                    <CalendarClock className="mb-1 h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{formatDate(a.date, { day: "2-digit", month: "short" })}</span>
                    <span className="text-sm font-semibold">{a.time}</span>
                  </div>
                  <Avatar name={a.patient?.full_name ?? "?"} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{a.patient?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{a.service?.name} · {a.professional?.full_name}</p>
                    {a.notes && <p className="mt-0.5 text-xs text-muted-foreground">Motivo: {a.notes}</p>}
                  </div>
                  <StatusBadge status={a.status} />
                  <div className="flex gap-2">
                    {a.status === "pendiente" && (
                      <Button size="sm" onClick={() => setStatus(a.id, "confirmada")}><Check className="h-4 w-4" /> Confirmar</Button>
                    )}
                    {(a.status === "pendiente" || a.status === "confirmada") && (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setStatus(a.id, "realizada")}>Realizada</Button>
                        <Button size="sm" variant="ghost" onClick={() => setStatus(a.id, "cancelada")}><X className="h-4 w-4" /></Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
