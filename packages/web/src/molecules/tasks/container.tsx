"use client";

import { Button, cn } from "@devboard-interactive/ui";
import { CreateTaskPayload, Task } from "@/types";
import { TaskForm, TaskFormProps } from "./form";
import { useEffect, useState } from "react";

import { Loader } from "./loader";
import { StatusFilter } from "./status-filter";
import { TaskList } from "./list";
import { useTasks } from "./context";

export function TasksContainer({ className }: { className?: string }) {
  const { loading, createTask, loadTasks, loadLabels, updateTask } = useTasks();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<TaskFormProps["mode"]>("create");
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleNew = () => {
    setFormMode("create");
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedTask(undefined);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormMode("edit");
    setIsFormVisible(true);
  };

  async function handleCreate(data: CreateTaskPayload) {
    await createTask(data);
    setIsFormVisible(false);
    await loadTasks();
  }

  async function handleUpdate(data: CreateTaskPayload) {
    if (!selectedTask) return;

    await updateTask(selectedTask.id, data);
    setIsFormVisible(false);
    setSelectedTask(undefined);
    await loadTasks();
  }

  useEffect(() => {
    // Load tasks should run everytime the filter changes.
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadLabels();
  }, []);

  return (
    <>
      {isFormVisible && formMode === "create" && (
        <TaskForm
          mode="create"
          onCancel={handleCancel}
          onSubmit={handleCreate}
        />
      )}
      {isFormVisible && formMode === "edit" && selectedTask && (
        <TaskForm
          mode="edit"
          task={selectedTask}
          onCancel={handleCancel}
          onSubmit={handleUpdate}
        />
      )}

      {!isFormVisible && (
        <Button variant="default" size="sm" onClick={handleNew}>
          Create New Task
        </Button>
      )}

      {!isFormVisible && (
        <div className={cn(className, "mt-4")}>
          <StatusFilter />

          {!!loading && <Loader text="Loading Tasks..." />}

          {!loading && <TaskList onEdit={handleEdit} />}
        </div>
      )}
    </>
  );
}
