import { Badge } from "@/components/ui/badge";
import { Check, Edit, Sparkles } from "lucide-react";
import type { DiffStatus } from "@/lib/diff-utils";

interface DiffBadgeProps {
  status: DiffStatus;
  className?: string;
}

export default function DiffBadge({ status, className = "" }: DiffBadgeProps) {
  const config = {
    published: {
      label: "Published",
      icon: Check,
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    modified: {
      label: "Modified",
      icon: Edit,
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    },
    new: {
      label: "New",
      icon: Sparkles,
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
  };

  const { label, icon: Icon, className: statusClass } = config[status];

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusClass} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
