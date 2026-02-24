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

function areTaskPropsEqual(prev: TaskProps, next: TaskProps) {
  // Check if callbacks changed (they should be stable, but good to check)
  if (
    prev.onEdit !== next.onEdit ||
    prev.onDelete !== next.onDelete ||
    prev.onClone !== next.onClone ||
    prev.isPending !== next.isPending
  ) {
    return false;
  }

  const p = prev.task;
  const n = next.task;

  // Fast path for reference equality
  if (p === n) return true;

  // Check unique ID first
  if (p.id !== n.id) return false;

  // Check primitive fields to ensure UI reflects optimistic updates.
  // Note: We check these manually because updatedAt might not be updated immediately in optimistic updates.
  // If you add a new visible field to TaskDto, you MUST update this check!
  if (
    p.title !== n.title ||
    p.description !== n.description ||
    p.status !== n.status ||
    p.priority !== n.priority
  ) {
    return false;
  }

  // Check Dates (serialize to timestamp to handle Date vs string)
  const getTime = (d: Date | string | null | undefined) => {
    if (!d) return 0;
    if (d instanceof Date) return d.getTime();
    return new Date(d).getTime();
  };

  if (getTime(p.updatedAt) !== getTime(n.updatedAt)) {
    return false;
  }

  if (getTime(p.dueDate) !== getTime(n.dueDate)) {
    return false;
  }

  // Check Labels (deep check for content changes like renamed labels)
  if (p.labels.length !== n.labels.length) {
    return false;
  }

  // Sort labels by ID for consistent comparison
  const pLabels = [...p.labels].sort((a, b) => a.id.localeCompare(b.id));
  const nLabels = [...n.labels].sort((a, b) => a.id.localeCompare(b.id));

  for (let i = 0; i < pLabels.length; i++) {
    const l1 = pLabels[i];
    const l2 = nLabels[i];
    if (l1.id !== l2.id || l1.name !== l2.name || l1.color !== l2.color) {
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