"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarPlus, CalendarDays, Dumbbell, Target, NotebookPen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getAppointmentsByPatient, getTreatmentPlansByPatient, getSessionsByPatient, getPatientExercises,
} from "@/lib/data/store";
import type { AppointmentDetailed, TreatmentPlan, TreatmentSession, PatientExercise, Exercise } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PortalPage() {
  const { user } = useAuth();
  const pid = user?.patient_id ?? "";
  const [appts, setAppts] = useState<AppointmentDetailed[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [sessions, setSessions] = useState<TreatmentSession[]>([]);
  const [exs, setExs] = useState<(PatientExercise & { exercise?: Exercise })[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!pid) return;
    Promise.all([
      getAppointmentsByPatient(pid), getTreatmentPlansByPatient(pid),
      getSessionsByPatient(pid), getPatientExercises(pid),
    ]).then(([a, p, s, e]) => { setAppts(a); setPlans(p); setSessions(s); setExs(e); setReady(true); });
  }, [pid]);

  if (!ready) return <LoadingState />;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appts.filter((a) => a.date >= today && a.status !== "cancelada");
  const plan = plans.find((p) => p.status === "activo") ?? plans[0];
  const lastSession = sessions[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Hola, {user?.full_name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">Este es el resumen de tu tratamiento</p>
        </div>
        <Button asChild><Link href="/agendar"><CalendarPlus className="h-4 w-4" /> Solicitar nueva hora</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-4 w-4" /> Próximas citas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">No tienes citas próximas. <Link href="/agendar" className="text-primary">Agenda una hora</Link>.</p>
            )}
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="w-16 text-center">
                  <p className="text-xs text-muted-foreground">{formatDate(a.date, { day: "2-digit", month: "short" })}</p>
                  <p className="text-sm font-semibold text-primary">{a.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.service?.name}</p>
                  <p className="text-xs text-muted-foreground">{a.professional?.full_name}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4" /> Mi tratamiento</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {plan ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estado</span><StatusBadge status={plan.status} />
                </div>
                <p><span className="text-muted-foreground">Diagnóstico:</span> {plan.diagnosis}</p>
                <p><span className="text-muted-foreground">Objetivo:</span> {plan.objective}</p>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Sesiones</span><span>{sessions.length}/{plan.sessions_planned}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-secondary" style={{ width: `${Math.min(100, (sessions.length / plan.sessions_planned) * 100)}%` }} />
                  </div>
                </div>
              </>
            ) : <p className="text-muted-foreground">Aún no tienes un plan activo.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Dumbbell className="h-4 w-4" /> Ejercicios recomendados</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {exs.map((e) => (
              <div key={e.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{e.exercise?.name}</p>
                <p className="text-xs text-muted-foreground">{e.exercise?.description}</p>
                <p className="mt-1 text-xs font-medium text-primary">{e.sets} series × {e.reps} reps · {e.frequency}</p>
              </div>
            ))}
            {exs.length === 0 && <p className="text-sm text-muted-foreground">Tu kinesiólogo aún no asigna ejercicios.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><NotebookPen className="h-4 w-4" /> Recomendaciones del kinesiólogo</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {lastSession ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Última sesión: {formatDate(lastSession.date, { day: "2-digit", month: "long" })}</p>
                <p><span className="text-muted-foreground">Avance:</span> {lastSession.progress_note}</p>
                <p><span className="text-muted-foreground">Recomendación:</span> {lastSession.next_recommendation}</p>
              </div>
            ) : <p className="text-muted-foreground">Aún no hay registros de sesiones.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
