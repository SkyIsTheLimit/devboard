import { LabelDto } from "@/types";
import { prisma } from "@/lib/prisma";
import { withAuth } from "./with-auth";

export const getLabels = withAuth(async () => {
  const labels: LabelDto[] = await prisma.label.findMany();
  return labels;
});
