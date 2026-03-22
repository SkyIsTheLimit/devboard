"use client";

import { cloneTask, deleteTask, hardDeleteTask, restoreTask } from "@/server/tasks";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import { Task } from "./task";
import { TaskDto } from "@/types";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const TaskCreateDialog = dynamic(
  () => import("./task-create-dialog").then((mod) => mod.TaskCreateDialog),
  { ssr: false }
);

const TaskEditSheet = dynamic(
  () => import("./task-edit-sheet").then((mod) => mod.TaskEditSheet),
  { ssr: false }
);

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

  // Lazy loading state
  const [hasEditOpened, setHasEditOpened] = useState(false);
  const [hasCreateOpened, setHasCreateOpened] = useState(false);

  // Map of taskId -> { toastId, clonedTaskId } for undo tracking
  const undoState = useRef<
    Map<string, { toastId: string | number; clonedTaskId?: string }>
  >(new Map());

  // Trigger lazy load for create dialog
  useEffect(() => {
    if (isCreateOpen) {
      setHasCreateOpened(true);
    }
  }, [isCreateOpen]);

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
  // Memoized to prevent array filtering and recreation on every render
  const visibleTasks = useMemo(
    () => [
      ...pendingClones,
      ...tasks.filter((task) => !pendingDeletes.has(task.id)),
    ],
    [pendingClones, tasks, pendingDeletes]
  );

  // Optimization: handleDelete and handleClone no longer depend on [tasks]
  // This makes them stable references, preventing Task components from re-rendering
  // when the list changes (e.g. optimistic updates).
  const handleDelete = useCallback(async (task: TaskDto) => {
    const taskId = task.id;
    if (taskId.startsWith("temp-")) return;

    const taskTitle = task.title;

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
  }, []);

  const handleClone = useCallback(async (task: TaskDto) => {
    const taskId = task.id;
    if (taskId.startsWith("temp-")) return;

    const opKey = `clone-${taskId}`;
    const tempId = `temp-${Date.now()}`;

    // Create temporary cloned task for optimistic UI
    const tempTask: TaskDto = {
      ...task,
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
      toast.error(`Failed to clone "${task.title}"`);
      return;
    }

    // Show toast with undo option
    const toastId = toast.success(`Cloned "${task.title}"`, {
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
  }, []);

  const handleEdit = useCallback((task: TaskDto) => {
    setHasEditOpened(true);
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

      {(hasCreateOpened || isCreateOpen) && (
        <TaskCreateDialog
          open={isCreateOpen}
          onOpenChange={onCreateOpenChange}
        />
      )}

      {(hasEditOpened || isEditOpen) && (
        <TaskEditSheet
          task={editingTask}
          open={isEditOpen}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
