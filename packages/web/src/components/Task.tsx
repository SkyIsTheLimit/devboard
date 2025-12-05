import { Status, Task as TaskModel } from "@/types";
import { Button } from "@devboard-interactive/ui";

const statusColors: Record<Status, "default" | "info" | "warning" | "success"> =
  {
    TODO: "default",
    IN_PROGRESS: "info",
    IN_REVIEW: "warning",
    DONE: "success",
  };

export const statusLabels: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const priorityIndicators: Record<string, string> = {
  LOW: "○",
  MEDIUM: "◐",
  HIGH: "●",
  URGENT: "◉",
};

export interface TaskProps extends React.HTMLAttributes<HTMLDivElement> {
  task: TaskModel;
  onEditTask?: (task: TaskModel) => void;
  handleStatusChange: (task: TaskModel, newStatus: Status) => void;
  handleDelete: (taskId: string) => void;
}

export function Task({
  task,
  onEditTask,
  handleStatusChange,
  handleDelete,
  ...props
}: TaskProps) {
  return (
    <div key={task.id} className={`mb-4 group`} {...props}>
      <div className="flex items-start gap-4">
        {/* Main content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0">
            <h3 className="text-base font-semibold truncate leading-tight text-neutral-400">
              {task.title}
            </h3>
            <span
              className="inline-block text-3xl text-yellow-300 bottom-0.5 relative leading-0"
              title={task.priority}
            >
              {priorityIndicators[task.priority]}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.labels.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center px-1 py-0.5 rounded text-sm font-medium"
                  style={{
                    backgroundColor: `${label.color}20`,
                    color: label.color,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="items-center gap-2 hidden group-hover:flex">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task, e.target.value as Status)}
            className="text-sm border rounded px-2 py-1"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onEditTask?.(task)}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(task.id)}
            className=""
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
