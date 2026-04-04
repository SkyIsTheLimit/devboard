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

// IMPORTANT: This comparison function must be updated if new props are added to Task component
// or if the TaskDto structure changes significantly.
function areTaskPropsEqual(prevProps: TaskProps, nextProps: TaskProps) {
  // Check if unstable props changed (e.g. function references, though we expect them to be stable)
  if (
    prevProps.onEdit !== nextProps.onEdit ||
    prevProps.onDelete !== nextProps.onDelete ||
    prevProps.onClone !== nextProps.onClone ||
    prevProps.isPending !== nextProps.isPending
  ) {
    return false;
  }

  const prevTask = prevProps.task;
  const nextTask = nextProps.task;

  // Check primitives and simple fields
  if (
    prevTask.id !== nextTask.id ||
    prevTask.title !== nextTask.title ||
    prevTask.description !== nextTask.description ||
    prevTask.status !== nextTask.status ||
    prevTask.priority !== nextTask.priority
  ) {
    return false;
  }

  // Check dates (handle potential string vs Date differences safely)
  const prevUpdated = new Date(prevTask.updatedAt).getTime();
  const nextUpdated = new Date(nextTask.updatedAt).getTime();
  if (prevUpdated !== nextUpdated) return false;

  const prevCreated = new Date(prevTask.createdAt).getTime();
  const nextCreated = new Date(nextTask.createdAt).getTime();
  if (prevCreated !== nextCreated) return false;

  // Check labels
  if (prevTask.labels.length !== nextTask.labels.length) {
    return false;
  }

  for (let i = 0; i < prevTask.labels.length; i++) {
    const prevLabel = prevTask.labels[i];
    const nextLabel = nextTask.labels[i];
    if (
      prevLabel.id !== nextLabel.id ||
      prevLabel.name !== nextLabel.name ||
      prevLabel.color !== nextLabel.color
    ) {
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