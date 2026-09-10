import { Badge } from "@/components/ui/badge";
import type { MobilHomeStatus } from "@/types/mobilhome";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MobilHomeStatus, string> = {
  AVAILABLE: "bg-status-available/10 text-status-available border-status-available/30",
  RESERVED: "bg-status-reserved/10 text-status-reserved border-status-reserved/30",
  SOLD: "bg-status-sold/10 text-status-sold border-status-sold/30",
};

export function StatusBadge({
  status,
  dict,
  className,
}: {
  status: MobilHomeStatus;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", STATUS_STYLES[status], className)}
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          status === "AVAILABLE" && "bg-status-available",
          status === "RESERVED" && "bg-status-reserved",
          status === "SOLD" && "bg-status-sold"
        )}
      />
      {dict.status[status]}
    </Badge>
  );
}
