"use client";

import { cloneTask, deleteTask, hardDeleteTask, restoreTask } from "@/server/tasks";
import { useCallback, useEffect, useRef, useState } from "react";

import { Task } from "./task";
import { TaskDto } from "@/types";
import { toast } from "sonner";
import { TaskCreateDialog } from "./task-create-dialog";
import { TaskEditSheet } from "./task-edit-sheet";

const UNDO_DURATION = 6000;

export function TasksListClient({
  tasks,
  isCreateOpen,
  onCreateOpenChange,
}: {
  tasks: TaskDto[];
  isCreateOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
}) {
  // Track pending deletes (task IDs that are optimistically removed but can be undone)
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  // Track pending clones (temp tasks shown optimistically before server confirms)
  const [pendingClones, setPendingClones] = useState<TaskDto[]>([]);

  // Sheet state for editing
  const [editingTask, setEditingTask] = useState<TaskDto | null>(null);
  const isEditOpen = editingTask !== null;

  // Map of taskId -> { toastId, clonedTaskId } for undo tracking
  const undoState = useRef<Map<string, { toastId: string | number; clonedTaskId?: string }>>(new Map());

  // Sync local state when props change (after revalidation)
  useEffect(() => {
    // Remove pending deletes for tasks that no longer exist in props (already deleted)
    setPendingDeletes((prev) => {
      const taskIds = new Set(tasks.map((t) => t.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (taskIds.has(id)) {
          next.add(id);
        }
      });
      return next.size !== prev.size ? next : prev;
    });

    // Remove pending clones when real task appears in props
    setPendingClones((prev) => {
      if (prev.length === 0) return prev;
      // Remove temp tasks - real ones will be in the tasks prop after revalidation
      return [];
    });
  }, [tasks]);

  // Derived state: visible tasks = props - pending deletes + pending clones
  const visibleTasks = [
    ...pendingClones,
    ...tasks.filter((task) => !pendingDeletes.has(task.id)),
  ];

  const handleDelete = useCallback(
    async (taskId: string) => {
      const originalTask = tasks.find((t) => t.id === taskId);
      if (!originalTask) return;

      const taskTitle = originalTask.title;

      // Dismiss any existing toast for this task
      const existing = undoState.current.get(taskId);
      if (existing) {
        toast.dismiss(existing.toastId);
      }

      // Optimistically hide the task
      setPendingDeletes((prev) => new Set(prev).add(taskId));

      // Immediately soft-delete on server
      try {
        await deleteTask(taskId);
      } catch {
        // Restore on failure
        setPendingDeletes((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        toast.error(`Failed to delete "${taskTitle}"`);
        return;
      }

      // Show toast with undo option
      const toastId = toast.success(`Deleted "${taskTitle}"`, {
        duration: UNDO_DURATION,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await restoreTask(taskId);
              setPendingDeletes((prev) => {
                const next = new Set(prev);
                next.delete(taskId);
                return next;
              });
            } catch {
              toast.error(`Failed to restore "${taskTitle}"`);
            } finally {
              undoState.current.delete(taskId);
            }
          },
        },
        onDismiss: () => {
          undoState.current.delete(taskId);
        },
      });

      undoState.current.set(taskId, { toastId });
    },
    [tasks],
  );

  const handleClone = useCallback(
    async (taskId: string) => {
      const originalTask = tasks.find((t) => t.id === taskId);
      if (!originalTask) return;

      const opKey = `clone-${taskId}`;
      const tempId = `temp-${Date.now()}`;

      // Create temporary cloned task for optimistic UI
      const tempTask: TaskDto = {
        ...originalTask,
        id: tempId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Optimistically add the cloned task
      setPendingClones((prev) => [tempTask, ...prev]);

      // Immediately clone on server
      let clonedTaskId: string;
      try {
        const result = await cloneTask(taskId);
        clonedTaskId = result.id;
        // Remove temp task - real one will appear via revalidation
        setPendingClones((prev) => prev.filter((t) => t.id !== tempId));
      } catch {
        // Remove temp task on failure
        setPendingClones((prev) => prev.filter((t) => t.id !== tempId));
        toast.error(`Failed to clone "${originalTask.title}"`);
        return;
      }

      // Show toast with undo option
      const toastId = toast.success(`Cloned "${originalTask.title}"`, {
        duration: UNDO_DURATION,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await hardDeleteTask(clonedTaskId);
            } catch {
              toast.error("Failed to undo clone");
            } finally {
              undoState.current.delete(opKey);
            }
          },
        },
        onDismiss: () => {
          undoState.current.delete(opKey);
        },
      });

      undoState.current.set(opKey, { toastId, clonedTaskId });
    },
    [tasks],
  );

  const handleEdit = useCallback((task: TaskDto) => {
    setEditingTask(task);
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-wrap p-1 w-full">
        {visibleTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onClone={handleClone}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <TaskCreateDialog open={isCreateOpen} onOpenChange={onCreateOpenChange} />

      <TaskEditSheet
        task={editingTask}
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
      />
    </>
  );
}
