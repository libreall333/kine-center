"use client";

import { useEffect, useState } from "react";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/spinner";
import { getProfessionals } from "@/lib/data/store";
import type { Professional } from "@/lib/types";

export default function ProfesionalesPage() {
  const [pros, setPros] = useState<Professional[] | null>(null);
  useEffect(() => { getProfessionals().then(setPros); }, []);
  if (!pros) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Profesionales" subtitle={`${pros.length} profesionales activos`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pros.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar name={p.full_name} className="h-12 w-12" />
                <div>
                  <p className="font-semibold">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">{p.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.specialties.map((s) => <Badge key={s} className="bg-accent text-accent-foreground border-transparent">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
