"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { LoadingState } from "@/components/ui/spinner";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return <LoadingState />;
  if (!user || user.role !== "paciente") {
    if (typeof window !== "undefined") router.push("/login");
    return <LoadingState label="Redirigiendo…" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </span>
            Kbody Sport
          </Link>
          <div className="flex items-center gap-3">
            <Avatar name={user.full_name} className="h-9 w-9 text-xs" />
            <span className="hidden text-sm font-medium sm:block">{user.full_name}</span>
            <Button variant="ghost" size="icon" onClick={() => { logout(); router.push("/login"); }} title="Salir">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-8">{children}</main>
    </div>
  );
}
