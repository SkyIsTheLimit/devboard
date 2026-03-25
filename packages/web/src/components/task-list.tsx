import { Status } from "@/types";
import { TasksListClient } from "./task-list-client";
import { getTasks } from "@/server/tasks";

export async function TasksList({ status }: { status?: Status | undefined }) {
  const tasks = await getTasks(status);

  return <TasksListClient tasks={tasks} />;
}
