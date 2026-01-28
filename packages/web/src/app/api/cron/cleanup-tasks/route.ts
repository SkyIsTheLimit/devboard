import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron - runs daily at 3am UTC
export const dynamic = "force-dynamic";

const RETENTION_DAYS = 30;

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

  const result = await prisma.task.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
        not: null,
      },
    },
  });

  console.log(`Cleanup: Permanently deleted ${result.count} soft-deleted tasks`);

  return NextResponse.json({
    success: true,
    deleted: result.count,
    cutoffDate: cutoffDate.toISOString(),
  });
}
