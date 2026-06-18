"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { LoadingState } from "@/components/ui/spinner";
import { getPatients } from "@/lib/data/store";
import type { Patient } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => { getPatients().then(setPatients); }, []);
  if (!patients) return <LoadingState />;

  const filtered = patients.filter((p) =>
    [p.full_name, p.rut, p.email].some((f) => f.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageTitle title="Pacientes" subtitle={`${patients.length} pacientes registrados`} />
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por nombre, RUT o correo" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((p) => (
              <Link key={p.id} href={`/dashboard/pacientes/${p.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/40">
                <Avatar name={p.full_name} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.full_name}</p>
                  <p className="text-sm text-muted-foreground">{p.rut} · {p.email}</p>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  <p>Ingreso</p>
                  <p>{formatDate(p.created_at, { day: "2-digit", month: "short", year: "numeric" })}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Sin resultados.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
