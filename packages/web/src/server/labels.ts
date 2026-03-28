"use server";

import { LabelDto } from "@/types";
import { prisma } from "@/lib/prisma";
import { withAuth } from "./with-auth";
import { cache } from "react";

export const getLabels = cache(
  withAuth(async () => {
    const labels: LabelDto[] = await prisma.label.findMany();
    return labels;
  }),
);
