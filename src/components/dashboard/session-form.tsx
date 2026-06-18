"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { addTreatmentSession } from "@/lib/data/store";
import { cn } from "@/lib/utils";

export function SessionForm({ planId, patientId, professionalId, onSaved }: {
  planId: string; patientId: string; professionalId: string; onSaved: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [pain, setPain] = useState(5);
  const [date, setDate] = useState(today);
  const [exercises, setExercises] = useState("");
  const [observations, setObservations] = useState("");
  const [progress, setProgress] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  async function save() {
    setSaving(true);
    await addTreatmentSession({
      plan_id: planId, patient_id: patientId, professional_id: professionalId,
      date, pain_level: pain, exercises_done: exercises, observations,
      progress_note: progress, next_recommendation: next, attachments: [],
    });
    setSaving(false);
    setOk(true);
    setExercises(""); setObservations(""); setProgress(""); setNext(""); setPain(5);
    onSaved();
    setTimeout(() => setOk(false), 2500);
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div>
          <Label htmlFor="date">Fecha de sesión</Label>
          <input id="date" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)}
            className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <Label>Dolor reportado: <span className="font-semibold text-primary">{pain}/10</span></Label>
          <input type="range" min={1} max={10} value={pain} onChange={(e) => setPain(Number(e.target.value))}
            className="mt-2 w-full accent-[hsl(var(--primary))]" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>Sin dolor</span><span>Máximo</span></div>
        </div>
        <Textareable label="Ejercicios indicados" value={exercises} onChange={setExercises} />
        <Textareable label="Observaciones" value={observations} onChange={setObservations} />
        <Textareable label="Avance del tratamiento" value={progress} onChange={setProgress} />
        <Textareable label="Próxima recomendación" value={next} onChange={setNext} />
        <Button className="w-full" onClick={save} disabled={saving || !exercises}>
          {saving ? <><Spinner className="h-4 w-4 text-primary-foreground" /> Guardando…</> : "Guardar sesión"}
        </Button>
        {ok && <p className={cn("text-center text-sm text-secondary")}>✓ Sesión registrada</p>}
      </CardContent>
    </Card>
  );
}

function Textareable({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea className="mt-1 min-h-[60px]" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
