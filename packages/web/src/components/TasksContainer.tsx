"use client";

import { useState } from "react";
import { CreateTaskForm } from "./CreateTaskForm";
import { TaskList } from "./TaskList";

export function TasksContainer() {
  const [isCreate, setIsCreate] = useState(false);
  return (
    <>
      {isCreate && (
        <CreateTaskForm
          onSuccess={() => setIsCreate(false)}
          onCancel={() => setIsCreate(false)}
        />
      )}

      {!isCreate && <TaskList onNew={() => setIsCreate(true)} />}
    </>
  );
}
