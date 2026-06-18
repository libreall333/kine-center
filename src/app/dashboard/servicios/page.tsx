"use client";

import { useEffect, useState } from "react";
import { PageTitle } from "@/components/dashboard/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceIcon } from "@/components/layout/icon";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/spinner";
import { getServices } from "@/lib/data/store";
import type { Service } from "@/lib/types";

export default function ServiciosAdminPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  useEffect(() => { getServices().then(setServices); }, []);
  if (!services) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Servicios" subtitle="Catálogo de prestaciones del centro" />
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {services.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <ServiceIcon name={s.icon} className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">${s.price_clp.toLocaleString("es-CL")}</p>
                  <p className="text-muted-foreground">{s.duration_min} min</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{s.active ? "Activo" : "Inactivo"}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
