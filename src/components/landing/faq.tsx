"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "¿Necesito una orden médica para atenderme?", a: "No es obligatoria para la evaluación inicial. Si tienes una orden o exámenes, ayúdanos trayéndolos para un mejor diagnóstico." },
  { q: "¿Cuánto dura una sesión?", a: "Entre 40 y 60 minutos según el servicio. La evaluación inicial suele ser más extensa." },
  { q: "¿Atienden con isapre o fonasa?", a: "Entregamos boleta para reembolso según tu previsión. Consulta por convenios vigentes al agendar." },
  { q: "¿Puedo ver mis ejercicios en casa?", a: "Sí. Desde tu portal de paciente accedes a los ejercicios y recomendaciones indicadas por tu kinesiólogo." },
  { q: "¿Cómo reagendo o cancelo una hora?", a: "Puedes hacerlo desde tu portal o contactándonos. Te pedimos avisar con al menos 24 horas de anticipación." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-muted/40 py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Preguntas frecuentes</h2>
          <p className="mt-3 text-muted-foreground">Resolvemos tus dudas más comunes.</p>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border bg-card">
              <button
                className="flex w-full items-center justify-between p-5 text-left font-medium"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
