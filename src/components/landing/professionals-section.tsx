import { professionals } from "@/lib/data/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfessionalsSection() {
  return (
    <section id="profesionales" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestro equipo</h2>
          <p className="mt-3 text-muted-foreground">Profesionales con experiencia comprometidos con tu recuperación.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-6 text-center">
                <Avatar name={p.full_name} className="mx-auto h-16 w-16 text-lg" />
                <h3 className="mt-4 font-semibold">{p.full_name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.title}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {p.specialties.map((s) => (
                    <Badge key={s} className="bg-accent text-accent-foreground border-transparent">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
