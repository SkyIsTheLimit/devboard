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

function areTaskPropsEqual(prev: TaskProps, next: TaskProps) {
  // Check primitive props and handlers
  if (
    prev.isPending !== next.isPending ||
    prev.onEdit !== next.onEdit ||
    prev.onDelete !== next.onDelete ||
    prev.onClone !== next.onClone
  ) {
    return false;
  }

  // Check task object identity/version
  const prevTask = prev.task;
  const nextTask = next.task;

  if (prevTask.id !== nextTask.id) return false;

  // Tasks are referentially different on every server fetch, but we only want to re-render
  // if the task data has actually changed. We use updatedAt as a version check.
  if (new Date(prevTask.updatedAt).getTime() !== new Date(nextTask.updatedAt).getTime()) return false;

  // Labels are a relation and might change. We check deep equality for labels.
  if (prevTask.labels.length !== nextTask.labels.length) return false;

  for (let i = 0; i < prevTask.labels.length; i++) {
    const pLabel = prevTask.labels[i];
    const nLabel = nextTask.labels[i];
    if (
        pLabel.id !== nLabel.id ||
        pLabel.name !== nLabel.name ||
        pLabel.color !== nLabel.color
    ) return false;
  }

  // Check remaining props (shallow comparison for things like className, style, etc.)
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (key === 'task' || key === 'onEdit' || key === 'onDelete' || key === 'onClone' || key === 'isPending') continue;
    if (prev[key as keyof TaskProps] !== next[key as keyof TaskProps]) return false;
  }

  return true;
}

// Memoized to prevent re-renders when parent state (like optimistic deletes) changes
// or when server revalidates data but this specific task hasn't changed.
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
