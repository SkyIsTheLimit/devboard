"use server";

import { LabelDto } from "@/types";
import { prisma } from "@/lib/prisma";
import { withAuth } from "./with-auth";
import { cache } from "react";

/**
 * Get all available labels.
 * Request-level memoized using React's cache() to prevent redundant DB hits
 * when fetched from multiple components in the same request.
 */
export const getLabels = cache(
  withAuth(async () => {
    const labels: LabelDto[] = await prisma.label.findMany();
    return labels;
  })
);
