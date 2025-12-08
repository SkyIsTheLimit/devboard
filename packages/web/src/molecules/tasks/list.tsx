"use client";

import { Empty } from "./empty";
import { Task } from "./task";
import type { Task as TaskModel } from "@/types";
import { useTasks } from "./context";

interface TaskListProps {
  onEdit?: (task: TaskModel) => void;
  onDelete?: (task: TaskModel) => void;
}

export function TaskList({ onEdit }: TaskListProps) {
  const { tasks, deleteTask } = useTasks();

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  return (
    <div>
      {tasks.length === 0 && <Empty />}

      {tasks.length !== 0 && (
        <div className="flex flex-wrap gap-4">
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
