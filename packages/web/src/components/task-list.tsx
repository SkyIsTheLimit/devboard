import { Status } from "@/types";
import { TasksListClient } from "./task-list-client";
import { getTasks } from "@/server/tasks";
import { getLabels } from "@/server/labels";

export async function TasksList({ status }: { status?: Status | undefined }) {
  const [tasks, labels] = await Promise.all([getTasks(status), getLabels()]);

  return <TasksListClient tasks={tasks} initialLabels={labels} />;
}
