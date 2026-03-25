"use client";

import { useState } from "react";
import { LabelDto, TaskDto } from "@/types";
import { TasksListClient } from "./task-list-client";
import { Container } from "./container";
import { Button } from "@devboard-interactive/ui/button";
import { Plus } from "lucide-react";

interface TaskPageWrapperProps {
  tasks: TaskDto[];
  initialLabels?: LabelDto[];
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  filter?: React.ReactNode;
}

export function TaskPageWrapper({ tasks, initialLabels, user, filter }: TaskPageWrapperProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  // Note: user and filter props are currently used by the layout component,
  // but passed here for completeness and potential future use.
  // To avoid lint warnings while keeping them in the interface:
  void user;
  void filter;

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
        initialLabels={initialLabels}
        isCreateOpen={isCreateOpen}
        onCreateOpenChange={setIsCreateOpen}
      />
    </Container>
  );
}
