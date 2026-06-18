import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CL", opts ?? { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export function formatTime(time: string) {
  // time as "HH:mm"
  return time;
}

export function formatRut(rut: string) {
  const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
}

export function validateRut(rut: string): boolean {
  const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  const expected = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return expected === dv;
}

export function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function classFromStatus(status: string): string {
  const map: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800 border-amber-200",
    confirmada: "bg-sky-100 text-sky-800 border-sky-200",
    cancelada: "bg-rose-100 text-rose-800 border-rose-200",
    realizada: "bg-emerald-100 text-emerald-800 border-emerald-200",
    activo: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pausado: "bg-amber-100 text-amber-800 border-amber-200",
    finalizado: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";
}
