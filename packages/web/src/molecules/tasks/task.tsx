"use client";

import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@devboard-interactive/ui";
import { ComponentProps, useCallback } from "react";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Status, Task as TaskModel } from "@/types";

import { Loader } from "./loader";
import { TaskLabels } from "./labels";
import { useTasks } from "./context";

export const statusColors: Record<
  Status,
  "default" | "info" | "warning" | "success"
> = {
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

export type TaskProps = {
  task: TaskModel;
  onEdit?: (updateTask: TaskModel) => void;
  onDelete?: (taskId: string) => void;
} & ComponentProps<typeof Item>;

export function Task({ task, onEdit, onDelete, ...props }: TaskProps) {
  const { loading } = useTasks();

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(task);
    }
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(task.id);
    }
  }, [onDelete, task.id]);

  return (
    <Item
      variant="outline"
      className="bg-card text-card-foreground flex-1 min-w-[280px] max-w-full md:max-w-sm"
      {...props}
    >
      <ItemContent>
        <ItemTitle>
          {task.title}
          <span
            className="inline-block text-3xl text-yellow-300 bottom-0.5 relative leading-0"
            title={task.priority}
          >
            {priorityIndicators[task.priority]}
          </span>
        </ItemTitle>
        <ItemDescription>{task.description}</ItemDescription>

        {task.labels.length > 0 && <TaskLabels labels={task.labels} />}
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <PenSquareIcon />
          Edit
        </Button>

        <Button
          variant="outline"
          disabled={!!loading}
          size="sm"
          onClick={handleDelete}
        >
          {!!loading && <Loader />}
          <Trash2Icon />
          Delete
        </Button>
      </ItemActions>
    </Item>
  );
}
