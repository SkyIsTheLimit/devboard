import { parseSearchForStatus, searchList } from "@/components/filter-status";

import { Filter } from "@/components/filter";

export default async function FilterSlot({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const searchItem = parseSearchForStatus(params.status);

  return <Filter activeItem={searchItem} searchList={searchList} />;
}
