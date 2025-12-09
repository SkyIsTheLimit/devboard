import * as Sentry from "@sentry/nextjs";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// GET /api/labels — List all labels
export async function GET() {
  try {
    const labels = await prisma.label.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return NextResponse.json(labels);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "GET /api/labels" },
    });

    console.error("Failed to fetch labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}

// POST /api/labels — Create a new label
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check for duplicate
    const existing = await prisma.label.findUnique({
      where: { name: name.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Label already exists" },
        { status: 409 }
      );
    }

    const label = await prisma.label.create({
      data: {
        name: name.trim().toLowerCase(),
        color: color || "#6B7280",
      },
    });

    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "POST /api/labels" },
    });

    console.error("Failed to create label:", error);
    return NextResponse.json(
      { error: "Failed to create label" },
      { status: 500 }
    );
  }
}
