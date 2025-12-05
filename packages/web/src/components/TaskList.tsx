"use client";

import { useState, useEffect } from "react";
import { Button, Card } from "@devboard-interactive/ui";
import { api } from "@/lib/api";
import type { Task as TaskModel, Status } from "@/types";
import { Label } from "./Label";
import { statusLabels, Task } from "./Task";

interface TaskListProps {
  onEditTask?: (task: TaskModel) => void;
  onNew?: () => void;
}

export function TaskList({ onEditTask, onNew }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  useEffect(() => {
    loadTasks(filter);
  }, [filter]);

  async function loadTasks(filter: Status | "ALL" = "ALL") {
    try {
      setLoading(true);
      const filters = filter !== "ALL" ? { status: filter } : undefined;
      const data = await api.tasks.list(filters);
      setTasks(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(task: TaskModel, newStatus: Status) {
    try {
      const updated = await api.tasks.update(task.id, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update task");
    }
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.tasks.delete(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete task");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {(["ALL", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const).map(
          (status) => (
            <Label
              key={status}
              name={status === "ALL" ? "All" : statusLabels[status]}
              className={`
                ${filter === status ? "bg-primary-2000 text-white" : ""}
                cursor-pointer
              `}
              onClick={() => setFilter(status)}
            />
          )
        )}

        <Button variant="secondary" size="sm" onClick={onNew}>
          New
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">
            No tasks found. Create your first task!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              handleStatusChange={handleStatusChange}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
