import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CalendarCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/40 via-background to-background" />
      <div className="container grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
        <div className="space-y-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-secondary">
            <span className="h-2 w-2 rounded-full bg-secondary" /> Rehabilitación basada en evidencia
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Recupera tu movimiento, <span className="text-primary">recupera tu vida</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Centro kinesiológico moderno con profesionales especializados en rehabilitación
            traumatológica, deportiva, respiratoria y neurológica. Agenda tu evaluación en línea
            y comienza tu recuperación hoy.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/agendar"><CalendarCheck className="mr-1" /> Agendar evaluación</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#servicios">Ver servicios</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            {["Atención personalizada", "Profesionales certificados", "Seguimiento digital"].map((t) => (
              <span key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> {t}</span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { n: "+5.000", l: "Pacientes tratados" },
              { n: "12 años", l: "De experiencia" },
              { n: "95%", l: "Satisfacción" },
              { n: "4", l: "Especialidades" },
            ].map((s, i) => (
              <div key={s.l} className="rounded-2xl border bg-card p-6 shadow-sm" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="text-3xl font-bold text-primary">{s.n}</p>
                <p className="text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
