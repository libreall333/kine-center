import { NextResponse, type NextRequest } from "next/server";

// Protección de rutas por rol leyendo la cookie de sesión (kv_session).
// /dashboard  -> admin, kinesiologo
// /portal     -> paciente
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("kv_session")?.value;

  let role: string | null = null;
  if (cookie) {
    try {
      role = JSON.parse(decodeURIComponent(cookie)).role ?? null;
    } catch {
      role = null;
    }
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isPortal = pathname.startsWith("/portal");

  if (isDashboard && role !== "admin" && role !== "kinesiologo") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isPortal && role !== "paciente") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*"],
};
