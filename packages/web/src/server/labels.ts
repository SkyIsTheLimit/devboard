"use server";

import { LabelDto } from "@/types";
import { prisma } from "@/lib/prisma";
import { withAuth } from "./with-auth";
import { cache } from "react";

/**
 * Fetches all available labels.
 * Wrapped with React's `cache` to provide request-level memoization for server-side fetches,
 * eliminating redundant database queries during a single request lifecycle.
 */
export const getLabels = cache(
  withAuth(async () => {
    const labels: LabelDto[] = await prisma.label.findMany();
    return labels;
  }),
);
