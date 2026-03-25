import { auth } from "@/auth";
import { parseSearchForStatus } from "@/components/filter-status";
import { redirect } from "next/navigation";
import { getTasks } from "@/server/tasks";
import { getLabels } from "@/server/labels";
import { TaskPageWrapper } from "@/components/task-page-wrapper";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const session = await auth();

  if (!session) redirect("/signin");

  const searchItem = parseSearchForStatus(searchParams.status?.toString());

  // Performance Optimization: Fetch tasks and labels in parallel to eliminate waterfall.
  // Both are server-side fetches, so parallelizing them reduces the total wait time to
  // the duration of the slowest request.
  const [tasks, labels] = await Promise.all([
    getTasks(searchItem.status),
    getLabels(),
  ]);

  return (
    <TaskPageWrapper
      tasks={tasks}
      initialLabels={labels}
    />
  );
}
