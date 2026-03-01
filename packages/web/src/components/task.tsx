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

// Memoized to prevent re-renders when parent state (like optimistic deletes) changes
// but this specific task hasn't changed.
//
// ⚡ Bolt: Custom comparison function to handle Server Component serialization differences
export const areTaskPropsEqual = (
  prevProps: TaskProps,
  nextProps: TaskProps
) => {
  // 1. Shallow compare non-task props
  if (
    prevProps.isPending !== nextProps.isPending ||
    prevProps.onEdit !== nextProps.onEdit ||
    prevProps.onDelete !== nextProps.onDelete ||
    prevProps.onClone !== nextProps.onClone
  ) {
    return false;
  }

  // 2. Fast path reference check
  if (prevProps.task === nextProps.task) {
    return true;
  }

  const prev = prevProps.task;
  const next = nextProps.task;

  // 3. Explicit comparison of visible task fields
  // We explicitly avoid relying on `updatedAt` to ensure UI consistency during optimistic updates.
  if (
    prev.id !== next.id ||
    prev.title !== next.title ||
    prev.description !== next.description ||
    prev.status !== next.status ||
    prev.priority !== next.priority
  ) {
    return false;
  }

  // Handle Date comparison (Server Components serialize dates to strings)
  const prevDate = prev.dueDate ? new Date(prev.dueDate).getTime() : null;
  const nextDate = next.dueDate ? new Date(next.dueDate).getTime() : null;

  if (prevDate !== nextDate) {
    return false;
  }

  // Compare labels (id, name, color) without allocating new arrays
  if (prev.labels.length !== next.labels.length) {
    return false;
  }

  // Since tasks usually have a small number of labels (0-3), O(N^2) search is
  // actually faster and allocates less memory than creating Sets or sorting.
  for (let i = 0; i < prev.labels.length; i++) {
    const pLabel = prev.labels[i];
    let found = false;

    for (let j = 0; j < next.labels.length; j++) {
      const nLabel = next.labels[j];
      if (
        pLabel.id === nLabel.id &&
        pLabel.name === nLabel.name &&
        pLabel.color === nLabel.color
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      return false;
    }
  }

  return true;
};

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