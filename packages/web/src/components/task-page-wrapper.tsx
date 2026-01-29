"use client";

import { useState } from "react";
import { TaskDto } from "@/types";
import { Header } from "./header";
import { TasksListClient } from "./task-list-client";
import { Container } from "./container";
import { Button } from "@devboard-interactive/ui/button";
import { Plus } from "lucide-react";

interface TaskPageWrapperProps {
  tasks: TaskDto[];
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  filter?: React.ReactNode;
}

export function TaskPageWrapper({ tasks, user, filter }: TaskPageWrapperProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  return (
    <Container className="flex-1 py-4 w-full">
      <Button
        onClick={handleCreate}
        size="lg"
        variant={'secondary'}
        className="gap-2 fixed bottom-8 right-8 md:static mb-3"
      >
        <Plus className="h-4 w-4" />
        <span className="md:inline">New Task</span>
      </Button>

      <TasksListClient
        tasks={tasks}
        isCreateOpen={isCreateOpen}
        onCreateOpenChange={setIsCreateOpen}
      />
    </Container>
  );
}
