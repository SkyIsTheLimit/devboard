import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabels } from "@/molecules/tasks";
import { useTasks } from "./context";

export type StatusFilterProps = {
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export function StatusFilter({ children, ...props }: StatusFilterProps) {
  const { filter, applyFilter: onFilterChange } = useTasks();

  return (
    <div className="flex gap-2 mb-4 flex-wrap items-center" {...props}>
      {(["ALL", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const).map(
        (status) => (
          <Badge
            key={status}
            className={cn(
              "rounded-full",
              filter !== status && "cursor-pointer"
            )}
            variant={filter === status ? "secondary" : "outline"}
            onClick={() => filter !== status && onFilterChange(status)}
          >
            {status === "ALL" ? "All" : statusLabels[status]}
          </Badge>
        )
      )}

      {children && children}
    </div>
  );
}
