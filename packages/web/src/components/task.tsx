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

/**
 * Custom equality check for React.memo.
 * NOTE: If you add new rendered properties to the Task component,
 * you must update this comparator to ensure UI consistency.
 */
function arePropsEqual(prev: TaskProps, next: TaskProps) {
  const { task: prevTask, ...prevRest } = prev;
  const { task: nextTask, ...nextRest } = next;

  // 1. Check Task Identity and Core Properties
  // We explicitly compare all rendered fields to ensure UI consistency
  // even if updatedAt is not modified by a specific database operation.
  if (
    prevTask.id !== nextTask.id ||
    prevTask.title !== nextTask.title ||
    prevTask.description !== nextTask.description ||
    prevTask.status !== nextTask.status ||
    prevTask.priority !== nextTask.priority
  ) {
    return false;
  }

  // 2. Check Timestamps (handles Date object vs string serialization)
  const prevUpdated = new Date(prevTask.updatedAt).getTime();
  const nextUpdated = new Date(nextTask.updatedAt).getTime();
  if (prevUpdated !== nextUpdated) return false;

  const prevDue = prevTask.dueDate ? new Date(prevTask.dueDate).getTime() : 0;
  const nextDue = nextTask.dueDate ? new Date(nextTask.dueDate).getTime() : 0;
  if (prevDue !== nextDue) return false;

  // 3. Check Labels
  if (prevTask.labels.length !== nextTask.labels.length) return false;
  // Labels are assumed to be few, so a simple loop is sufficient.
  for (let i = 0; i < prevTask.labels.length; i++) {
    const p = prevTask.labels[i];
    const n = nextTask.labels[i];
    if (p.id !== n.id || p.name !== n.name || p.color !== n.color) {
      return false;
    }
  }

  // 4. Shallow compare rest of props (handlers, isPending, etc.)
  const prevKeys = Object.keys(prevRest) as (keyof typeof prevRest)[];
  const nextKeys = Object.keys(nextRest) as (keyof typeof nextRest)[];
  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (prevRest[key] !== nextRest[key]) {
      return false;
    }
  }

  return true;
}

// Memoized to prevent re-renders when parent state (like optimistic deletes) changes
// but this specific task hasn't changed. This is a critical performance optimization
// for large task lists with frequent optimistic updates.
export const Task = memo(
  function Task({
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
  },
  arePropsEqual,
);
