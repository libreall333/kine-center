import Link from "next/link";
import { services } from "@/lib/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ServiceIcon } from "@/components/layout/icon";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ServicesSection() {
  return (
    <section id="servicios" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">Nuestros servicios</h2>
        <p className="mt-3 text-muted-foreground">
          Tratamientos especializados para cada etapa de tu recuperación.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className="group transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </div>
              <CardTitle>{s.name}</CardTitle>
              <CardDescription>{s.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{s.duration_min} min</span>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/agendar?service=${s.id}`}>Agendar <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
