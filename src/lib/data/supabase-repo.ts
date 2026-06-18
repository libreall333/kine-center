// REFERENCIA: implementación equivalente a store.ts usando Supabase.
//
// Cuando quieras pasar de mock a producción:
//   1. Crea el proyecto en Supabase y ejecuta supabase/schema.sql (y seed.sql opcional).
//   2. Completa .env.local y pon NEXT_PUBLIC_USE_SUPABASE=true.
//   3. En store.ts, enruta cada función a estas implementaciones cuando `useSupabase` sea true.
//
// Ejemplo de patrón (descomenta y adapta):
//
// import { getSupabaseClient } from "@/lib/supabase/client";
// import type { Service } from "@/lib/types";
//
// export async function getServices(): Promise<Service[]> {
//   const sb = getSupabaseClient();
//   if (!sb) return [];
//   const { data, error } = await sb.from("services").select("*").eq("active", true);
//   if (error) throw error;
//   return data as Service[];
// }
//
// export async function createAppointment(input: NewAppointmentInput) {
//   const sb = getSupabaseClient()!;
//   // upsert paciente por rut, luego insert appointment...
// }
export {};
