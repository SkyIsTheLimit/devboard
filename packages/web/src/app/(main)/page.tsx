import { auth } from "@/auth";
import { parseSearchForStatus } from "@/components/filter-status";
import { redirect } from "next/navigation";
import { getTasks } from "@/server/tasks";
import { getLabels } from "@/server/labels";
import { TaskPageWrapper } from "@/components/task-page-wrapper";
import { Filter } from "@/components/filter";
import { searchList } from "@/components/filter-status";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const session = await auth();

  if (!session) redirect("/signin");

  const searchItem = parseSearchForStatus(searchParams.status?.toString());

  // Prefetch tasks and labels in parallel to eliminate waterfalls and reduce TTFB
  const [tasks, labels] = await Promise.all([
    getTasks(searchItem.status),
    getLabels(),
  ]);

  return (
    <TaskPageWrapper
      tasks={tasks}
      initialLabels={labels}
      user={session.user}
      filter={<Filter activeItem={searchItem} searchList={searchList} />}
    />
  );
}
