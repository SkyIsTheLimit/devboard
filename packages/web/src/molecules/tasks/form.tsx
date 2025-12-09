"use client";

import {
  Button,
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@devboard-interactive/ui";
import type { CreateTaskPayload, Priority, Task } from "@/types";
import { SelectableLabel, TaskLabels } from "./labels";
import { useMemo, useState } from "react";

import { Loader } from "./loader";
import { useTasks } from "./context";

export type TaskFormProps = {
  onSubmit?: (data: CreateTaskPayload) => void;
  onCancel?: () => void;
} & (
  | {
      mode: "create";
      task?: undefined;
    }
  | {
      mode: "edit";
      task: Task;
    }
);

export function TaskForm({ mode, task, onSubmit, onCancel }: TaskFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { labels, loading } = useTasks();
  const [labelSelectionMap, setLabelSelectionMap] = useState<
    Record<string, boolean>
  >({
    ...(task
      ? task.labels?.reduce((acc, label) => {
          acc[label.id] = true;
          return acc;
        }, {} as Record<string, boolean>)
      : {}),
  });

  const selectableLabels: SelectableLabel[] = useMemo(() => {
    return labels.map((label) => ({
      ...label,
      selected: !!labelSelectionMap[label.id],
    }));
  }, [labels, labelSelectionMap]);

  const [formData, setFormData] = useState<CreateTaskPayload>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "LOW",
    status: task?.status ?? "TODO",
    labelIds: task?.labels.map((label) => label.id) ?? [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    onSubmit?.({
      ...formData,
      labelIds: selectableLabels
        .filter((label) => label.selected)
        .map((label) => label.id),
    });
  }

  function handleToggle(label: SelectableLabel) {
    setLabelSelectionMap((prev) => ({
      ...prev,
      [label.id]: !prev[label.id],
    }));
  }

  return (
    <Card className="p-6 max-w-[500px]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-md">
        <div className="flex flex-col space-y-1.5">
          <legend className="font-semibold tracking-tight text-lg">
            {mode === "create" && "Create a New Task"}
            {mode === "edit" && "Edit Task"}
          </legend>

          <p className="text-sm text-muted-foreground text-balance">
            {mode === "create"
              ? "Fill out the form below to add a new task to your task list."
              : "Update the task details below."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          placeholder="Add more details..."
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Label htmlFor="priority">Priority</Label>
        <Select
          name="priority"
          onValueChange={(value: Priority) =>
            setFormData((formData) => ({ ...formData, priority: value }))
          }
          value={formData.priority}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Priority..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"LOW" as Priority}>Low</SelectItem>
              <SelectItem value={"MEDIUM" as Priority}>Medium</SelectItem>
              <SelectItem value={"HIGH" as Priority}>High</SelectItem>
              <SelectItem value={"URGENT" as Priority}>Urgent</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {labels.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labels
            </label>
            <div className="flex flex-wrap gap-2">
              <TaskLabels
                labels={selectableLabels}
                mode="selectable"
                onToggle={handleToggle}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant={!!loading ? "outline" : "default"}
            size="sm"
            disabled={!!loading}
            onClick={handleSubmit}
          >
            {!!loading && <Loader />}

            {mode === "create" && !loading && "Create Task"}
            {mode === "create" && !!loading && "Creating Task..."}

            {mode === "edit" && !loading && "Save Changes"}
            {mode === "edit" && !!loading && "Saving Changes..."}
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
