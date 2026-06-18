"use client";

import Link from "next/link";
import { useState } from "react";
import { HeartPulse, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#profesionales", label: "Profesionales" },
  { href: "/#faq", label: "Preguntas" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const dashHref = user?.role === "paciente" ? "/portal" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </span>
          Kbody Sport
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Button asChild variant="outline" size="sm"><Link href={dashHref}>Mi panel</Link></Button>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link href="/login">Ingresar</Link></Button>
          )}
          <Button asChild size="sm"><Link href="/agendar">Agendar evaluación</Link></Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-6 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1"><Link href="/login">Ingresar</Link></Button>
            <Button asChild size="sm" className="flex-1"><Link href="/agendar">Agendar</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
