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

// Helper to compare dates that might come as strings from Server Components
const isSameDate = (
  a: Date | string | null | undefined,
  b: Date | string | null | undefined,
) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return new Date(a).getTime() === new Date(b).getTime();
};

export const areTaskPropsEqual = (
  prevProps: TaskProps,
  nextProps: TaskProps,
) => {
  // 1. Shallow comparison of non-task props (isPending, callbacks, HTML attributes)
  const { task: prevTask, ...prevRest } = prevProps;
  const { task: nextTask, ...nextRest } = nextProps;

  const prevKeys = Object.keys(prevRest);
  if (prevKeys.length !== Object.keys(nextRest).length) return false;
  for (const key of prevKeys) {
    if (
      (prevRest as Record<string, unknown>)[key] !==
      (nextRest as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  // 2. Fast path for reference equality
  if (prevTask === nextTask) return true;

  // 3. Shallow comparison of all task fields EXCEPT updatedAt, labels, and dueDate
  // We DELIBERATELY EXCLUDE updatedAt from this comparison.
  // When a task is optimistically updated on the client, its content changes
  // but updatedAt might not match the server's new timestamp yet. If we
  // depended on updatedAt, the component might revert to a stale state
  // or re-render unnecessarily when the server finally syncs.
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatedAt: _prevUpdatedAt,
    labels: prevLabels,
    dueDate: prevDueDate,
    ...prevTaskRest
  } = prevTask;

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatedAt: _nextUpdatedAt,
    labels: nextLabels,
    dueDate: nextDueDate,
    ...nextTaskRest
  } = nextTask;

  const taskKeys = Object.keys(
    prevTaskRest,
  ) as Array<keyof typeof prevTaskRest>;
  if (taskKeys.length !== Object.keys(nextTaskRest).length) return false;

  for (const key of taskKeys) {
    if (prevTaskRest[key] !== nextTaskRest[key]) {
      return false;
    }
  }

  // Compare dueDate specially since it might be a Date object or string
  if (!isSameDate(prevDueDate, nextDueDate)) return false;

  // 4. Deep comparison of labels safely handling undefined
  const safePrevLabels = prevLabels || [];
  const safeNextLabels = nextLabels || [];
  if (safePrevLabels.length !== safeNextLabels.length) return false;

  // Assumes labels are generally stable in order, or we can just check IDs
  // Since labels are small, a simple ID check is usually sufficient
  const prevLabelIds = [...safePrevLabels].map((l) => l.id).sort();
  const nextLabelIds = [...safeNextLabels].map((l) => l.id).sort();

  for (let i = 0; i < prevLabelIds.length; i++) {
    if (prevLabelIds[i] !== nextLabelIds[i]) return false;
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