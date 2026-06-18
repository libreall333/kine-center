import {
  Activity, Bone, Brain, Hand, PersonStanding, Wind, HeartPulse,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Activity, Bone, Brain, Hand, PersonStanding, Wind, HeartPulse,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? HeartPulse;
  return <Icon className={className} />;
}
