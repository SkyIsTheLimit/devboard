import { Status } from "@/types";
import { Task } from "./task";
import { getTasks } from "@/server/tasks";

export async function TasksList({ status }: { status?: Status | undefined }) {
  const tasks = await getTasks(status);

  return (
    <div className="flex gap-4 flex-wrap p-1 w-full">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}
