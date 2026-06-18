import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="container pb-20">
      <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold">Comienza tu recuperación hoy</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
          Agenda tu evaluación inicial en línea. Es rápido, simple y el primer paso para volver a moverte sin dolor.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-6">
          <Link href="/agendar">Agendar evaluación</Link>
        </Button>
      </div>
    </section>
  );
}
