"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Check, ChevronLeft, ChevronRight, CalendarCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceIcon } from "@/components/layout/icon";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { cn, formatDate, formatRut, validateRut } from "@/lib/utils";
import { services, professionals } from "@/lib/data/mock-data";
import { getAvailableSlots, createAppointment } from "@/lib/data/store";

const steps = ["Servicio", "Profesional", "Fecha y hora", "Tus datos", "Confirmación"];

const patientSchema = z.object({
  full_name: z.string().min(3, "Ingresa tu nombre completo"),
  email: z.string().email("Correo no válido"),
  phone: z.string().min(8, "Teléfono no válido"),
  rut: z.string().refine(validateRut, "RUT no válido"),
  reason: z.string().min(5, "Cuéntanos brevemente el motivo"),
});

function nextDays(n: number) {
  const out: { value: string; label: string; weekday: string }[] = [];
  const d = new Date();
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue; // sin domingos
    out.push({
      value: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }),
      weekday: d.toLocaleDateString("es-CL", { weekday: "short" }),
    });
    added++;
  }
  return out;
}

export function BookingWizard({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [serviceId, setServiceId] = useState(initialService ?? "");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", rut: "", reason: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const days = useMemo(() => nextDays(12), []);
  const service = services.find((s) => s.id === serviceId);
  const professional = professionals.find((p) => p.id === professionalId);

  useEffect(() => {
    if (step === 2 && professionalId && date) {
      setLoadingSlots(true);
      setTime("");
      getAvailableSlots(professionalId, date).then((s) => {
        setSlots(s);
        setLoadingSlots(false);
      });
    }
  }, [step, professionalId, date]);

  const canNext =
    (step === 0 && serviceId) ||
    (step === 1 && professionalId) ||
    (step === 2 && date && time) ||
    step === 3;

  function validateForm() {
    const res = patientSchema.safeParse(form);
    if (!res.success) {
      const e: Record<string, string> = {};
      res.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
      setErrors(e);
      return false;
    }
    setErrors({});
    return true;
  }

  async function submit() {
    if (!validateForm()) return;
    setSubmitting(true);
    const appt = await createAppointment({
      patient: form,
      professional_id: professionalId,
      service_id: serviceId,
      date,
      time,
    });
    setConfirmedId(appt.id);
    setSubmitting(false);
    setStep(4);
  }

  function goNext() {
    if (step === 3) return submit();
    if (canNext) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-8 flex items-center justify-between">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                  i < step && "bg-secondary text-secondary-foreground border-secondary",
                  i === step && "bg-primary text-primary-foreground border-primary",
                  i > step && "text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">{label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-secondary" : "bg-border")} />}
          </li>
        ))}
      </ol>

      <Card>
        <CardContent className="p-6">
          {/* Paso 0: servicio */}
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:border-primary",
                    serviceId === s.id && "border-primary bg-accent/50"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.duration_min} min · ${s.price_clp.toLocaleString("es-CL")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Paso 1: profesional */}
          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {professionals.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfessionalId(p.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:border-primary",
                    professionalId === p.id && "border-primary bg-accent/50"
                  )}
                >
                  <Avatar name={p.full_name} />
                  <div>
                    <p className="font-medium">{p.full_name}</p>
                    <p className="text-xs text-muted-foreground">{p.specialties.join(" · ")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Paso 2: fecha y hora */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Selecciona una fecha</Label>
                <div className="flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDate(d.value)}
                      className={cn(
                        "w-16 rounded-lg border p-2 text-center transition-colors hover:border-primary",
                        date === d.value && "border-primary bg-primary text-primary-foreground"
                      )}
                    >
                      <span className="block text-xs capitalize">{d.weekday}</span>
                      <span className="block text-sm font-semibold capitalize">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {date && (
                <div>
                  <Label className="mb-2 block">Horarios disponibles</Label>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Buscando disponibilidad…</div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay horarios disponibles este día. Prueba otra fecha.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => setTime(s)}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm transition-colors hover:border-primary",
                            time === s && "border-primary bg-primary text-primary-foreground"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: datos */}
          {step === 3 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="full_name">Nombre completo</Label>
                <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                {errors.full_name && <FieldError msg={errors.full_name} />}
              </div>
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <FieldError msg={errors.email} />}
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+56 9 ..." />
                {errors.phone && <FieldError msg={errors.phone} />}
              </div>
              <div>
                <Label htmlFor="rut">RUT</Label>
                <Input id="rut" value={form.rut} onChange={(e) => setForm({ ...form, rut: formatRut(e.target.value) })} placeholder="12.345.678-9" />
                {errors.rut && <FieldError msg={errors.rut} />}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="reason">Motivo de consulta</Label>
                <Textarea id="reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Describe brevemente tu molestia o el motivo de la consulta" />
                {errors.reason && <FieldError msg={errors.reason} />}
              </div>
            </div>
          )}

          {/* Paso 4: confirmación */}
          {step === 4 && confirmedId && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <CalendarCheck className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-bold">¡Reserva solicitada!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu hora quedó <strong>pendiente de confirmación</strong>. Te enviaremos un correo a {form.email}.
              </p>
              <div className="mx-auto mt-6 max-w-sm rounded-xl border bg-muted/40 p-4 text-left text-sm">
                <Row k="Servicio" v={service?.name} />
                <Row k="Profesional" v={professional?.full_name} />
                <Row k="Fecha" v={date ? formatDate(date, { weekday: "long", day: "2-digit", month: "long" }) : ""} />
                <Row k="Hora" v={time} />
                <Row k="N° reserva" v={confirmedId} />
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild variant="outline"><Link href="/">Volver al inicio</Link></Button>
                <Button asChild><Link href="/login">Ir a mi portal</Link></Button>
              </div>
            </div>
          )}

          {/* Resumen lateral inferior + navegación */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between border-t pt-5">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button onClick={goNext} disabled={!canNext || submitting}>
                {submitting ? <><Spinner className="h-4 w-4 text-primary-foreground" /> Enviando…</> : step === 3 ? "Confirmar reserva" : <>Continuar <ChevronRight className="h-4 w-4" /></>}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" /> {msg}</p>;
}
function Row({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="flex justify-between border-b py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
