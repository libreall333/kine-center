"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, Fingerprint, MapPin, Plus, Activity, ClipboardList, NotebookPen,
} from "lucide-react";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { LoadingState } from "@/components/ui/spinner";
import { SessionForm } from "@/components/dashboard/session-form";
import {
  getPatient, getAppointmentsByPatient, getTreatmentPlansByPatient,
  getSessionsByPatient, getPatientExercises,
} from "@/lib/data/store";
import type { Patient, AppointmentDetailed, TreatmentPlan, TreatmentSession, PatientExercise, Exercise } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null | undefined>(undefined);
  const [appts, setAppts] = useState<AppointmentDetailed[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [sessions, setSessions] = useState<TreatmentSession[]>([]);
  const [exs, setExs] = useState<(PatientExercise & { exercise?: Exercise })[]>([]);

  const load = () => {
    Promise.all([
      getPatient(id), getAppointmentsByPatient(id), getTreatmentPlansByPatient(id),
      getSessionsByPatient(id), getPatientExercises(id),
    ]).then(([p, a, pl, s, e]) => {
      setPatient(p ?? null); setAppts(a); setPlans(pl); setSessions(s); setExs(e);
    });
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (patient === undefined) return <LoadingState />;
  if (patient === null) return <p className="text-sm text-muted-foreground">Paciente no encontrado.</p>;

  const activePlan = plans.find((p) => p.status === "activo") ?? plans[0];

  return (
    <div>
      <Link href="/dashboard/pacientes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a pacientes
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar name={patient.full_name} className="h-14 w-14 text-lg" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{patient.full_name}</h1>
          <p className="text-sm text-muted-foreground">{patient.reason}</p>
        </div>
        {activePlan && <StatusBadge status={activePlan.status} />}
      </div>

      <Tabs defaultValue="ficha">
        <TabsList>
          <TabsTrigger value="ficha">Ficha</TabsTrigger>
          <TabsTrigger value="tratamiento">Tratamiento</TabsTrigger>
          <TabsTrigger value="evolucion">Evolución</TabsTrigger>
          <TabsTrigger value="citas">Historial de citas</TabsTrigger>
        </TabsList>

        {/* FICHA */}
        <TabsContent value="ficha">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Datos de contacto</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Info icon={Fingerprint} label="RUT" value={patient.rut} />
                <Info icon={Mail} label="Correo" value={patient.email} />
                <Info icon={Phone} label="Teléfono" value={patient.phone} />
                <Info icon={MapPin} label="Dirección" value={patient.address ?? "—"} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Información clínica</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><span className="text-muted-foreground">Motivo de consulta:</span> {patient.reason}</p>
                {activePlan ? (
                  <>
                    <p><span className="text-muted-foreground">Diagnóstico:</span> {activePlan.diagnosis}</p>
                    <p><span className="text-muted-foreground">Objetivo:</span> {activePlan.objective}</p>
                    <p><span className="text-muted-foreground">Estado:</span> <StatusBadge status={activePlan.status} /></p>
                  </>
                ) : <p className="text-muted-foreground">Sin plan de tratamiento.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TRATAMIENTO */}
        <TabsContent value="tratamiento">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {plans.map((pl) => (
                <Card key={pl.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">{pl.diagnosis}</CardTitle>
                    <StatusBadge status={pl.status} />
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Objetivo:</span> {pl.objective}</p>
                    <div className="flex gap-6 text-muted-foreground">
                      <span><ClipboardList className="mr-1 inline h-4 w-4" />{pl.sessions_planned} sesiones planificadas</span>
                      <span><Activity className="mr-1 inline h-4 w-4" />Inicio {formatDate(pl.start_date, { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {plans.length === 0 && <p className="text-sm text-muted-foreground">Sin planes de tratamiento.</p>}
            </div>
            <Card>
              <CardHeader><CardTitle className="text-base">Ejercicios indicados</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {exs.map((e) => (
                  <div key={e.id} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{e.exercise?.name}</p>
                    <p className="text-xs text-muted-foreground">{e.sets} series × {e.reps} reps · {e.frequency}</p>
                    {e.notes && <p className="mt-1 text-xs text-muted-foreground">{e.notes}</p>}
                  </div>
                ))}
                {exs.length === 0 && <p className="text-sm text-muted-foreground">Sin ejercicios asignados.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EVOLUCIÓN */}
        <TabsContent value="evolucion">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><NotebookPen className="h-4 w-4" /> Bitácora de sesiones</h3>
              <div className="space-y-4 border-l-2 border-border pl-5">
                {sessions.map((s) => (
                  <div key={s.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{formatDate(s.date, { weekday: "short", day: "2-digit", month: "short" })}</p>
                          <PainBadge level={s.pain_level} />
                        </div>
                        <dl className="mt-2 space-y-1 text-sm">
                          <Field k="Ejercicios" v={s.exercises_done} />
                          <Field k="Observaciones" v={s.observations} />
                          <Field k="Avance" v={s.progress_note} />
                          <Field k="Próxima recomendación" v={s.next_recommendation} />
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {sessions.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay sesiones registradas.</p>}
              </div>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><Plus className="h-4 w-4" /> Registrar sesión</h3>
              {activePlan ? (
                <SessionForm
                  planId={activePlan.id}
                  patientId={patient.id}
                  professionalId={activePlan.professional_id}
                  onSaved={load}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Crea un plan de tratamiento para registrar sesiones.</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* CITAS */}
        <TabsContent value="citas">
          <Card>
            <CardContent className="divide-y p-0">
              {appts.map((a) => (
                <div key={a.id} className="flex items-center gap-4 p-4">
                  <div className="w-20 text-center text-sm">
                    <p className="text-muted-foreground">{formatDate(a.date, { day: "2-digit", month: "short" })}</p>
                    <p className="font-semibold">{a.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.service?.name}</p>
                    <p className="text-xs text-muted-foreground">{a.professional?.full_name}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
              {appts.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Sin citas registradas.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function Field({ k, v }: { k: string; v: string }) {
  return <div><dt className="text-xs text-muted-foreground">{k}</dt><dd>{v}</dd></div>;
}
function PainBadge({ level }: { level: number }) {
  const tone = level >= 7 ? "bg-rose-100 text-rose-700" : level >= 4 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>Dolor {level}/10</span>;
}
