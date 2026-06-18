// Cliente Supabase (preparado pero opcional en esta entrega).
//
// Para activarlo: completa las variables en .env.local y pon
// NEXT_PUBLIC_USE_SUPABASE=true. Luego implementa las consultas en
// lib/data/supabase-repo.ts y enruta lib/data/store.ts hacia ese repo.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === "true";

export function getSupabaseClient(): SupabaseClient | null {
  if (!useSupabase) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("Supabase activado pero faltan variables de entorno.");
    return null;
  }
  if (!client) client = createClient(url, key);
  return client;
}
