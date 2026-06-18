import { PublicShell } from "@/components/layout/public-shell";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata = { title: "Agendar evaluación · Kbody Sport" };

export default function AgendarPage({ searchParams }: { searchParams: { service?: string } }) {
  return (
    <PublicShell>
      <section className="container py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">Agenda tu evaluación</h1>
          <p className="mt-3 text-muted-foreground">
            Completa los pasos para reservar tu hora. Solo te tomará un minuto.
          </p>
        </div>
        <BookingWizard initialService={searchParams.service} />
      </section>
    </PublicShell>
  );
}
