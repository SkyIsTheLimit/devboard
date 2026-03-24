import { auth } from "@/auth";
import { parseSearchForStatus } from "@/components/filter-status";
import { redirect } from "next/navigation";
import { getTasks } from "@/server/tasks";
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
  const tasks = await getTasks(searchItem.status);

  return (
    <TaskPageWrapper
      tasks={tasks}
      user={session.user}
      filter={<Filter activeItem={searchItem} searchList={searchList} />}
    />
  );
}
