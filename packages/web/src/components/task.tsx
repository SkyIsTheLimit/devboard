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

const areTaskPropsEqual = (prevProps: TaskProps, nextProps: TaskProps) => {
  // Check if handlers and simple props changed
  if (
    prevProps.isPending !== nextProps.isPending ||
    prevProps.onEdit !== nextProps.onEdit ||
    prevProps.onDelete !== nextProps.onDelete ||
    prevProps.onClone !== nextProps.onClone
  ) {
    return false;
  }

  const prevTask = prevProps.task;
  const nextTask = nextProps.task;

  // Check ID
  if (prevTask.id !== nextTask.id) return false;

  // Check simple fields
  if (prevTask.title !== nextTask.title) return false;
  if (prevTask.description !== nextTask.description) return false;
  if (prevTask.status !== nextTask.status) return false;
  if (prevTask.priority !== nextTask.priority) return false;

  // Check timestamps safely (handles Date object vs string serialization)
  const prevUpdatedAt = new Date(prevTask.updatedAt).getTime();
  const nextUpdatedAt = new Date(nextTask.updatedAt).getTime();
  if (prevUpdatedAt !== nextUpdatedAt) return false;

  const prevDueDate = prevTask.dueDate
    ? new Date(prevTask.dueDate).getTime()
    : 0;
  const nextDueDate = nextTask.dueDate
    ? new Date(nextTask.dueDate).getTime()
    : 0;
  if (prevDueDate !== nextDueDate) return false;

  // Check labels structure just in case (e.g. relation update without task timestamp update)
  if (prevTask.labels.length !== nextTask.labels.length) return false;

  // Deep compare sorted labels
  const prevLabels = [...prevTask.labels].sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  const nextLabels = [...nextTask.labels].sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  for (let i = 0; i < prevLabels.length; i++) {
    const l1 = prevLabels[i];
    const l2 = nextLabels[i];
    if (l1.id !== l2.id || l1.name !== l2.name || l1.color !== l2.color) {
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