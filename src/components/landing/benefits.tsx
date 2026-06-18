import { ShieldCheck, Clock, Users, Smartphone, HeartHandshake, LineChart } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "Basado en evidencia", desc: "Protocolos actualizados y respaldados científicamente." },
  { icon: Users, title: "Equipo especializado", desc: "Profesionales certificados en distintas áreas de la kinesiología." },
  { icon: Smartphone, title: "Portal digital", desc: "Revisa tus citas, ejercicios y avances desde cualquier dispositivo." },
  { icon: Clock, title: "Horarios flexibles", desc: "Agenda en línea con disponibilidad de lunes a sábado." },
  { icon: HeartHandshake, title: "Atención humana", desc: "Trato cercano y un plan diseñado para ti." },
  { icon: LineChart, title: "Seguimiento real", desc: "Medimos tu progreso sesión a sesión para mejores resultados." },
];

export function Benefits() {
  return (
    <section id="beneficios" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">¿Por qué elegirnos?</h2>
        <p className="mt-3 text-muted-foreground">Cuidamos cada detalle de tu recuperación.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="flex gap-4 rounded-2xl border bg-card p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <b.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
