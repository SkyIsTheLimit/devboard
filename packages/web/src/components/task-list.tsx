import { Status } from "@/types";
import { TasksListClient } from "./task-list-client";
import { getTasks } from "@/server/tasks";
import { getLabels } from "@/server/labels";

export async function TasksList({ status }: { status?: Status | undefined }) {
  const tasks = await getTasks(status);
  const labels = await getLabels();

  return <TasksListClient tasks={tasks} initialLabels={labels} />;
}
