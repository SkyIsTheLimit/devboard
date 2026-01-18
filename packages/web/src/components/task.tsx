"use client";

import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@devboard-interactive/ui";
import { ComponentProps, useCallback } from "react";
import { Copy, Flag, PenSquareIcon, Trash2Icon } from "lucide-react";
import { Status, TaskDto as TaskModel } from "@/types";
import { createTask, deleteTask } from "@/server/tasks";

import { TaskLabels } from "./labels";
import { cn } from "@/lib/utils";

export const statusColors: Record<
  Status,
  "default" | "info" | "warning" | "success"
> = {
  TODO: "default",
  IN_PROGRESS: "info",
  IN_REVIEW: "warning",
  DONE: "success",
};

export const statusLabels: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export type TaskProps = {
  task: TaskModel;
  onEdit?: (updateTask: TaskModel) => void;
} & ComponentProps<typeof Item>;

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export function Task({ task, onEdit, ...props }: TaskProps) {
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(task);
    }
  }, [onEdit, task]);

  const handleDelete = () => deleteTask(task.id);

  const handleClone = () => {};

  return (
    <Item
      variant="outline"
      className="bg-card text-card-foreground md:min-w-sm w-full max-w-full md:max-w-sm p-0 items-start flex flex-col justify-between"
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
        <ItemDescription>{task.description}</ItemDescription>

        {task.labels.length > 0 && <TaskLabels labels={task.labels} />}
      </ItemContent>

      <ItemActions className="mt-4 p-2 border-t w-full flex justify-between items-center">
        <div>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <PenSquareIcon />
            Edit
          </Button>

          <Button
            variant="ghost"
            // disabled={!!loading}
            size="sm"
            // onClick={() => handleDelete(task.id)}
          >
            {/* {!!loading && <Loader />} */}
            <Copy />
            Clone
          </Button>
        </div>
        <Button
          variant="ghost"
          // disabled={!!loading}
          size="sm"
          onClick={() => handleDelete()}
        >
          {/* {!!loading && <Loader />} */}
          <Trash2Icon />
        </Button>
      </ItemActions>
    </Item>
  );
}
