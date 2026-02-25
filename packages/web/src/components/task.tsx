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

function areTaskPropsEqual(prevProps: TaskProps, nextProps: TaskProps) {
  // Check simple props (functions are stable via useCallback usually, but strict check is good)
  if (
    prevProps.isPending !== nextProps.isPending ||
    prevProps.onEdit !== nextProps.onEdit ||
    prevProps.onDelete !== nextProps.onDelete ||
    prevProps.onClone !== nextProps.onClone
  ) {
    return false;
  }

  // Compare other props (passed to Item) - shallow compare
  const {
    task: pt,
    onEdit: pe,
    onDelete: pd,
    onClone: pc,
    isPending: pp,
    ...prevRest
  } = prevProps;
  const {
    task: nt,
    onEdit: ne,
    onDelete: nd,
    onClone: nc,
    isPending: np,
    ...nextRest
  } = nextProps;

  const prevKeys = Object.keys(prevRest);
  const nextKeys = Object.keys(nextRest);
  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (
      prevRest[key as keyof typeof prevRest] !==
      nextRest[key as keyof typeof nextRest]
    )
      return false;
  }

  const prevTask = prevProps.task;
  const nextTask = nextProps.task;

  if (prevTask === nextTask) {
    return true;
  }

  // Optimized comparison: check ID and updatedAt.
  // If updatedAt is the same, we assume the task data (including relations like labels) hasn't changed.
  // This avoids deep comparison of all fields and arrays.
  if (prevTask.id !== nextTask.id) {
    return false;
  }

  const prevUpdated = new Date(prevTask.updatedAt).getTime();
  const nextUpdated = new Date(nextTask.updatedAt).getTime();

  return prevUpdated === nextUpdated;
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