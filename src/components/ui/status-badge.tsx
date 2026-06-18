import { Badge } from "@/components/ui/badge";
import { classFromStatus } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={classFromStatus(status)}>{status}</Badge>;
}
