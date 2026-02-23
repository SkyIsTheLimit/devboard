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
// Also implements custom comparison to handle new object references from server with same content.
const areTaskPropsEqual = (prevProps: TaskProps, nextProps: TaskProps) => {
  // 1. Check handlers (should be stable, but good to check)
  if (
    prevProps.onEdit !== nextProps.onEdit ||
    prevProps.onDelete !== nextProps.onDelete ||
    prevProps.onClone !== nextProps.onClone ||
    prevProps.isPending !== nextProps.isPending
  ) {
    return false;
  }

  // 2. Check task object
  const prev = prevProps.task;
  const next = nextProps.task;

  if (prev === next) return true; // Reference equality shortcut

  // Primitive fields
  if (
    prev.id !== next.id ||
    prev.title !== next.title ||
    prev.description !== next.description ||
    prev.status !== next.status ||
    prev.priority !== next.priority
  ) {
    return false;
  }

  // Date fields (handle string vs Date)
  const getTime = (d: Date | string | null | undefined) =>
    d ? new Date(d).getTime() : 0;

  if (getTime(prev.updatedAt) !== getTime(next.updatedAt)) return false;
  if (getTime(prev.dueDate) !== getTime(next.dueDate)) return false;

  // Labels
  if (prev.labels.length !== next.labels.length) return false;

  // Deep compare labels (assuming order matters or is consistent)
  // We use a loop for performance instead of sort
  for (let i = 0; i < prev.labels.length; i++) {
    const l1 = prev.labels[i];
    const l2 = next.labels[i];
    if (l1.id !== l2.id || l1.name !== l2.name || l1.color !== l2.color) {
      return false;
    }
  }

  // 3. Check other props (shallow) - passed to Item
  // We exclude known props that we already checked
  const allKeys = new Set([
    ...Object.keys(prevProps),
    ...Object.keys(nextProps),
  ]);
  for (const key of allKeys) {
    if (
      key === "task" ||
      key === "onEdit" ||
      key === "onDelete" ||
      key === "onClone" ||
      key === "isPending"
    )
      continue;
    if (
      prevProps[key as keyof TaskProps] !== nextProps[key as keyof TaskProps]
    ) {
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