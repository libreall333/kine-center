import { CalendarCheck, ClipboardList, Dumbbell, TrendingUp } from "lucide-react";

const steps = [
  { icon: CalendarCheck, title: "Agenda tu hora", desc: "Reserva en línea eligiendo servicio, profesional y horario disponible." },
  { icon: ClipboardList, title: "Evaluación inicial", desc: "Un kinesiólogo evalúa tu caso y diseña un plan de tratamiento personalizado." },
  { icon: Dumbbell, title: "Tratamiento", desc: "Sesiones guiadas con ejercicios y técnicas adaptadas a tu progreso." },
  { icon: TrendingUp, title: "Seguimiento", desc: "Monitorea tu evolución y recomendaciones desde tu portal de paciente." },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Cómo funciona</h2>
          <p className="mt-3 text-muted-foreground">Un proceso claro y acompañado, de principio a fin.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border bg-card p-6">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <s.icon className="mb-3 h-8 w-8 text-secondary" />
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
