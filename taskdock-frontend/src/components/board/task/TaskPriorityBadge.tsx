// THIRD PARTY COMPONENTS
import { Badge } from "@/components/ui/badge";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "HIGHEST";

interface Props {
  priority: Priority;
}

const variants: Record<Priority, string> = {
  LOW: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  HIGHEST: "bg-red-100 text-red-700 border-red-200",
};

export function TaskPriorityBadge({ priority }: Props) {
  return (
    <Badge variant="outline" className={variants[priority]}>
      {priority}
    </Badge>
  );
}
