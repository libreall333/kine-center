import Link from "next/link";
import { HeartPulse, MapPin, Phone, Mail, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </span>
            Kbody Sport
          </Link>
          <p className="text-sm text-muted-foreground">
            Centro kinesiológico dedicado a tu recuperación y bienestar con un enfoque humano y basado en evidencia.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Navegación</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#servicios" className="hover:text-foreground">Servicios</Link></li>
            <li><Link href="/#profesionales" className="hover:text-foreground">Profesionales</Link></li>
            <li><Link href="/agendar" className="hover:text-foreground">Agendar hora</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Portal pacientes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contacto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Av. Los Pajaritos 3195, Of. 202, Maipú</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +56 9 7858 8844</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contacto@kinesiologiakbody.cl</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Horario</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Lun a Vie: 08:00 – 20:00</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Sábado: 09:00 – 14:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kbody Sport · Centro Kinesiológico. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
