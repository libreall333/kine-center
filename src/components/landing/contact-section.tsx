import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  return (
    <section id="contacto" className="container py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visítanos</h2>
          <p className="mt-3 text-muted-foreground">
            Estamos en pleno corazón de Providencia, con fácil acceso en transporte público.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: MapPin, label: "Dirección", value: "Av. Los Pajaritos 3195, Of. 202, Maipú, Región Metropolitana" },
              { icon: Phone, label: "Teléfono", value: "+56 9 7858 8844" },
              { icon: Mail, label: "Correo", value: "contacto@kinesiologiakbody.cl" },
              { icon: Clock, label: "Horario", value: "Lun a Vie 08:00–20:00 · Sáb 09:00–14:00" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <iframe
              title="Ubicación Kbody Sport"
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              src="https://www.google.com/maps?q=Av.+Los+Pajaritos+3195,+Maip%C3%BA,+Regi%C3%B3n+Metropolitana&output=embed"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
