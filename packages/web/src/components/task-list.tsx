import { Status } from "@/types";
import { TasksListClient } from "./task-list-client";
import { getTasks } from "@/server/tasks";
import { getLabels } from "@/server/labels";

export async function TasksList({ status }: { status?: Status | undefined }) {
  // Parallel fetch tasks and labels to eliminate sequential waterfalls
  const [tasks, labels] = await Promise.all([getTasks(status), getLabels()]);

  return <TasksListClient tasks={tasks} initialLabels={labels} />;
}
