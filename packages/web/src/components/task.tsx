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
  // 1. Shallow comparison of non-task props
  if (
    prev.onEdit !== next.onEdit ||
    prev.onDelete !== next.onDelete ||
    prev.onClone !== next.onClone ||
    prev.isPending !== next.isPending ||
    Object.keys(prev).filter(k => !['task', 'onEdit', 'onDelete', 'onClone', 'isPending'].includes(k)).some(k => (prev as Record<string, unknown>)[k] !== (next as Record<string, unknown>)[k])
  ) {
    return false;
  }

  // 2. Fast path reference check
  if (prev.task === next.task) {
    return true;
  }

  // 3. Explicit comparison of visible task fields
  const pTask = prev.task;
  const nTask = next.task;

  if (
    pTask.id !== nTask.id ||
    pTask.title !== nTask.title ||
    pTask.description !== nTask.description ||
    pTask.status !== nTask.status ||
    pTask.priority !== nTask.priority
  ) {
    return false;
  }

  // Compare dueDate (handling Next.js serialization strings to Date)
  const prevDueDate = pTask.dueDate ? new Date(pTask.dueDate).getTime() : null;
  const nextDueDate = nTask.dueDate ? new Date(nTask.dueDate).getTime() : null;
  if (prevDueDate !== nextDueDate) {
    return false;
  }

  // Deep comparison of labels
  if (pTask.labels.length !== nTask.labels.length) {
    return false;
  }

  // Ensure labels are identical in id, name, and color
  for (let i = 0; i < pTask.labels.length; i++) {
    const pLabel = pTask.labels[i];

    // Fallback search if order changes (though typically ordered by db query)
    const matchingLabel = nTask.labels.find(l => l.id === pLabel.id);
    if (
      !matchingLabel ||
      pLabel.name !== matchingLabel.name ||
      pLabel.color !== matchingLabel.color
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