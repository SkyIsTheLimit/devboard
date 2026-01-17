import { Container } from "@/components/container";
import { TasksList } from "@/components/task-list";
import { auth } from "@/auth";
import { parseSearchForStatus } from "@/components/FilterStatus";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const session = await auth();

  if (!session) redirect("/signin");

  const searchItem = parseSearchForStatus(searchParams.status?.toString());

  return (
    <Container className="flex-1 py-4 w-full">
      <TasksList status={searchItem.status} />
    </Container>
  );
}
