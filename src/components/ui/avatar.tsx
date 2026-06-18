import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name: string; className?: string }) {
  const init = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold", className)}>
      {init}
    </div>
  );
}
