"use client";

import { ComponentProps, memo, useCallback } from "react";
import { Copy, Flag, Loader2, PenSquareIcon, Trash2Icon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@devboard-interactive/ui/item";
import { Status, TaskDto as TaskModel } from "@/types";

import { Button } from "@devboard-interactive/ui/button";
import { TaskLabels } from "./labels";
import { cn } from "@/lib/utils";

export type TaskProps = {
  task: TaskModel;
  onEdit?: (updateTask: TaskModel) => void;
  onDelete?: (task: TaskModel) => void;
  onClone?: (task: TaskModel) => void;
  isPending?: boolean;
} & ComponentProps<typeof Item>;

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Custom comparison function for React.memo to prevent unnecessary re-renders
// since Server Components serialize Date objects to strings, causing new object
// references on every render.
const areTaskPropsEqual = (prev: TaskProps, next: TaskProps) => {
  // 1. Shallow comparison of non-task props
  if (
    prev.onEdit !== next.onEdit ||
    prev.onDelete !== next.onDelete ||
    prev.onClone !== next.onClone ||
    prev.isPending !== next.isPending
  ) {
    return false;
  }

  // 2. Fast path reference check
  if (prev.task === next.task) {
    return true;
  }

  // 3. Explicit comparison of visible task fields
  if (
    prev.task.id !== next.task.id ||
    prev.task.title !== next.task.title ||
    prev.task.description !== next.task.description ||
    prev.task.status !== next.task.status ||
    prev.task.priority !== next.task.priority
  ) {
    return false;
  }

  // Handle Date comparison (might be strings from Server Components)
  const prevDueDate = prev.task.dueDate ? new Date(prev.task.dueDate).getTime() : null;
  const nextDueDate = next.task.dueDate ? new Date(next.task.dueDate).getTime() : null;

  if (prevDueDate !== nextDueDate) {
    return false;
  }

  // Deep comparison of labels
  if (prev.task.labels.length !== next.task.labels.length) {
    return false;
  }

  for (let i = 0; i < prev.task.labels.length; i++) {
    const prevLabel = prev.task.labels[i];
    const nextLabel = next.task.labels[i];

    if (
      prevLabel.id !== nextLabel.id ||
      prevLabel.name !== nextLabel.name ||
      prevLabel.color !== nextLabel.color
    ) {
      return false;
    }
  }

  return true;
};

// Memoized to prevent re-renders when parent state (like optimistic deletes) changes
// but this specific task hasn't changed.
export const Task = memo(function Task({
  task,
  onEdit,
  onDelete,
  onClone,
  isPending,
  ...props
}: TaskProps) {
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(task);
    }
  }, [onEdit, task]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task);
    }
  };

  const handleClone = () => {
    if (onClone) {
      onClone(task);
    }
  };

  return (
    <Item
      variant="outline"
      className="bg-card text-card-foreground md:min-w-sm w-full max-w-full md:max-w-sm p-0 items-start flex flex-col justify-between gap-0"
      {...props}
    >
      <ItemContent className="p-4 w-full">
        <div className="flex items-center justify-between">
          <ItemTitle className="font-black">{task.title}</ItemTitle>
          <span
            className={cn(
              "inline-flex items-center gap-2 font-normal text-secondary",
            )}
            title={`${task.priority.toLowerCase()} priority`}
          >
            <Flag size={16} />
            {capitalize(task.priority)}
          </span>
        </div>
        <ItemDescription className="line-clamp-4 h-full">
          {task.description}
        </ItemDescription>

        {task.labels.length > 0 && <TaskLabels labels={task.labels} />}
      </ItemContent>

      <ItemActions className="p-2 border-t w-full flex justify-between items-center">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            disabled={isPending}
          >
            <PenSquareIcon />
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClone}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            <Copy />
            Clone
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          <Trash2Icon />
        </Button>
      </ItemActions>
    </Item>
  );
}, areTaskPropsEqual);