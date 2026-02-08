import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PriorityIndicatorProps = {
  priority: number;
  className?: string;
  showLabel?: boolean;
};

export function PriorityIndicator({
  priority,
  className,
  showLabel = true,
}: PriorityIndicatorProps) {
  const isHigh = priority >= 7;
  const isMedium = priority >= 4 && priority < 7;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {isHigh && <span className="text-lg">🔥</span>}
      {showLabel && (
        <Badge
          variant={isHigh ? "destructive" : isMedium ? "default" : "secondary"}
          className={cn(
            isHigh &&
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
            isMedium &&
              "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
          )}
        >
          Priority: {priority}
        </Badge>
      )}
    </div>
  );
}
