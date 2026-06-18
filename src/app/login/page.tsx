"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HeartPulse, ShieldCheck, Stethoscope, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth/auth-context";
import { getUserByEmail } from "@/lib/data/store";
import type { Role } from "@/lib/types";

const demoAccounts: { role: Role; email: string; label: string; icon: typeof ShieldCheck; dest: string }[] = [
  { role: "admin", email: "admin@kinesiologiakbody.cl", label: "Administrador", icon: ShieldCheck, dest: "/dashboard" },
  { role: "kinesiologo", email: "kine@kinesiologiakbody.cl", label: "Kinesiólogo", icon: Stethoscope, dest: "/dashboard" },
  { role: "paciente", email: "maria.gonzalez@example.com", label: "Paciente", icon: UserIcon, dest: "/portal" },
];

function LoginInner() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn(targetEmail: string, fallbackDest: string) {
    setLoading(true);
    setError("");
    const user = await getUserByEmail(targetEmail);
    if (!user) {
      setError("No encontramos una cuenta con ese correo. Usa una cuenta demo.");
      setLoading(false);
      return;
    }
    login({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      patient_id: user.patient_id ?? null,
      professional_id: user.professional_id ?? null,
    });
    const dest = next ?? (user.role === "paciente" ? "/portal" : "/dashboard");
    router.push(dest || fallbackDest);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 font-bold text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </span>
          Kbody Sport
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ingresar</CardTitle>
            <CardDescription>Accede a tu panel según tu rol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@correo.cl" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={loading || !email} onClick={() => signIn(email, "/dashboard")}>
              {loading ? <><Spinner className="h-4 w-4 text-primary-foreground" /> Ingresando…</> : "Ingresar"}
            </Button>

            <div className="relative py-1 text-center text-xs text-muted-foreground">
              <span className="bg-card px-2">o entra con una cuenta demo</span>
              <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
            </div>

            <div className="grid gap-2">
              {demoAccounts.map((a) => (
                <Button key={a.role} variant="outline" className="justify-start" disabled={loading} onClick={() => signIn(a.email, a.dest)}>
                  <a.icon className="h-4 w-4" /> {a.label} <span className="ml-auto text-xs text-muted-foreground">{a.email}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Aún no eres paciente? <Link href="/agendar" className="text-primary font-medium">Agenda tu evaluación</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <LoginInner />
    </Suspense>
  );
}
