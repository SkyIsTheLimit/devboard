import { Badge, BadgeProps } from "@/components/ui/badge";

import { Label } from "@/types";

export type TaskLabelProps = {
  label: Label;
} & BadgeProps;

export const TaskLabel = ({ label, style, ...props }: TaskLabelProps) => (
  <Badge
    key={label.id}
    variant="outline"
    className="font-semibold cursor-pointer"
    style={{
      ...style,
      borderColor: `${label.color}20`,
      backgroundColor: `${label.color}20`,
      color: label.color,
    }}
    {...props}
  >
    {label.name}
  </Badge>
);
