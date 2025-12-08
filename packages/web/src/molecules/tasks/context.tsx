"use client";

import { CreateTaskPayload, Label, Status, Task as TaskModel } from "@/types";
import { createContext, useCallback, useContext, useState } from "react";

import { api } from "@/lib/api";

export type TasksContextState = {
  tasks: TaskModel[];
  labels: Label[];
  filter: Status | "ALL";

  loading: number;
  error?: string | null;
};

export type TasksContextActions = {
  applyFilter: (filter: Status | "ALL") => void;

  loadTasks: () => Promise<void>;
  loadLabels: () => Promise<void>;
  createTask: (newTaskData: CreateTaskPayload) => Promise<TaskModel>;
  updateTask: (
    taskId: string,
    updatedData: Partial<TaskModel>
  ) => Promise<TaskModel>;
  deleteTask: (taskId: string) => Promise<void>;
};

export type TasksContextType = TasksContextState & TasksContextActions;

export const TasksContext = createContext<TasksContextType | undefined>(
  undefined
);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [loading, setLoading] = useState(0);
  //   const [error, setError] = useState<string | null>(null);

  const applyFilter = (newFilter: Status | "ALL") => {
    setFilter(newFilter);
  };

  async function loadLabels() {
    setLoading((count) => count + 1);
    const data = await api.labels.list();
    setLabels(data);
    setLoading((count) => count - 1);
  }

  const loadTasks = useCallback(async () => {
    setLoading((count) => count + 1);
    const data = await api.tasks.list({
      status: filter !== "ALL" ? filter : undefined,
    });
    setTasks(data);
    setLoading((count) => count - 1);
  }, [filter]);

  async function updateTask(taskId: string, updatedData: Partial<TaskModel>) {
    setLoading((count) => count + 1);
    const updated = await api.tasks.update(taskId, updatedData);
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    setLoading((count) => count - 1);
    return updated;
  }

  async function deleteTask(taskId: string) {
    setLoading((count) => count + 1);
    await api.tasks.delete(taskId);
    setLoading((count) => count - 1);
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  async function createTask(newTaskData: CreateTaskPayload) {
    setLoading((count) => count + 1);
    const created = await api.tasks.create(newTaskData);
    setTasks([...tasks, created]);
    setLoading((count) => count - 1);
    return created;
  }

  return (
    <TasksContext.Provider
      value={{
        labels,
        tasks,
        filter,
        loading,
        // error,
        applyFilter,
        loadLabels,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TasksContext);

  if (!ctx) {
    throw new Error("useTasks must be used within a TasksProvider");
  }

  return ctx;
};

/**
 *
 * // TasksProvider ->
 *      state: { tasks, filter },
 *      actions: {
 *          loadTasks(filter),
 *          createNewTask(newTaskData),
 *          updateTask(taskId, updatedData),
 *          deleteTask(taskId)
 *     }
 * <TasksProvider>
 *  <TasksContainer> -- pulls state and actions from context to provide to stateless children.
 *    <StatusFilter filter={context.filter} onFilterChange={context.onFilterChange} /> -- Stateless, uses props.onFilterChange to update.
 *    <Button>New Task</Button> -- opens a form to create a new task.
 *      <TaskForm mode="create" /> -- maintains form instance to create a new task, uses props.onCreate since mode is 'create'
 *    <TaskList tasks={context.tasks} onUpdate onDelete /> -- Stateless, gets tasks from parent.
 *    <TaskActions /> -- Contains 'Edit Task', 'Delete Task' actions, uses props.onEdit and props.onDelete
 *      <TaskForm mode="edit" onEdit /> -- maintains form instance to edit an existing task, uses props.onEdit since mode is 'edit'
 *   </TasksContainer>
 * </TasksProvider>
 *
 */
