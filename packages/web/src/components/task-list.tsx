import { Status, LabelDto } from "@/types";
import { TasksListClient } from "./task-list-client";
import { getTasks } from "@/server/tasks";

export async function TasksList({ status, initialLabels = [] }: { status?: Status | undefined, initialLabels?: LabelDto[] }) {
  const tasks = await getTasks(status);

  return <TasksListClient tasks={tasks} initialLabels={initialLabels} />;
}
