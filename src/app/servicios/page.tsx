import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { services } from "@/lib/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ServiceIcon } from "@/components/layout/icon";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Servicios · Kbody Sport" };

export default function ServiciosPage() {
  return (
    <PublicShell>
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">Servicios kinesiológicos</h1>
          <p className="mt-3 text-muted-foreground">
            Conoce en detalle nuestras especialidades y agenda la que necesitas.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </div>
                <CardTitle>{s.name}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Duración</span><span>{s.duration_min} min</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Valor referencial</span>
                  <span>${s.price_clp.toLocaleString("es-CL")}</span>
                </div>
                <Button asChild className="w-full"><Link href={`/agendar?service=${s.id}`}>Agendar</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
