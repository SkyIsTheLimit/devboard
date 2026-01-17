import { parseSearchForStatus, searchList } from "@/components/FilterStatus";

import { Filter } from "@/components/Filter";

export default async function FilterSlot({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const searchItem = parseSearchForStatus(params.status);

  return <Filter activeItem={searchItem} searchList={searchList} />;
}
