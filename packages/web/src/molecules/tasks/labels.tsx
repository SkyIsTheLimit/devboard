import { Label } from "@/types";
import { TaskLabel } from "./label";

export type SelectableLabel = Label & { selected: boolean };

export type TaskLabelsProps =
  | {
      mode?: "selectable";
      labels: SelectableLabel[];
      onToggle?: (label: SelectableLabel) => void;
    }
  | {
      mode?: "normal";
      labels: Label[];
      onToggle?: never;
    };

export function TaskLabels({
  mode = "normal",
  labels,
  onToggle,
}: TaskLabelsProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {labels.map((label) => (
        <TaskLabel
          key={label.id}
          label={label}
          style={{
            opacity:
              mode === "selectable"
                ? (label as SelectableLabel).selected
                  ? 1
                  : 0.3
                : 1,
          }}
          onClick={() => {
            if (mode === "selectable") {
              onToggle?.(label as SelectableLabel);
            }
          }}
        />
      ))}
    </div>
  );
}
