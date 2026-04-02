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
import { TaskDto as TaskModel } from "@/types";

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

// Custom comparison to handle Next.js Server Components passing newly serialized
// object references on every render, invalidating standard React.memo.
function areTaskPropsEqual(prev: TaskProps, next: TaskProps) {
  // Shallow comparison of all non-task props to prevent stale closures
  for (const key in prev) {
    if (key !== "task" && prev[key as keyof TaskProps] !== next[key as keyof TaskProps]) {
      return false;
    }
  }
  for (const key in next) {
    if (key !== "task" && !(key in prev)) {
      return false;
    }
  }

  // Fast path reference check for the task object
  if (prev.task === next.task) return true;

  const pt = prev.task;
  const nt = next.task;

  // Explicit comparison of visible task fields dynamically
  const keys = new Set([...Object.keys(pt), ...Object.keys(nt)]) as Set<keyof TaskModel>;

  for (const key of keys) {
    // Avoid relying on updatedAt to ensure UI consistency during optimistic updates
    if (key === "updatedAt" || key === "createdAt") continue;

    if (key === "dueDate") {
      // Handle Date and string representations safely
      const prevDueDate = pt.dueDate ? new Date(pt.dueDate).getTime() : null;
      const nextDueDate = nt.dueDate ? new Date(nt.dueDate).getTime() : null;
      if (prevDueDate !== nextDueDate) return false;
      continue;
    }

    if (key === "labels") {
      // Deep comparison of labels
      const prevLabels = pt.labels || [];
      const nextLabels = nt.labels || [];
      if (prevLabels.length !== nextLabels.length) return false;

      for (let i = 0; i < prevLabels.length; i++) {
        const pl = prevLabels[i];
        const nl = nextLabels[i];
        if (pl.id !== nl.id || pl.name !== nl.name || pl.color !== nl.color) {
          return false;
        }
      }
      continue;
    }

    if (pt[key] !== nt[key]) {
      return false;
    }
  }

  return true;
}

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

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(task);
    }
  }, [onDelete, task]);

  const handleClone = useCallback(() => {
    if (onClone) {
      onClone(task);
    }
  }, [onClone, task]);

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