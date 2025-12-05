import { Priority, Status } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status: status as Status }),
        ...(priority && { priority: priority as Priority }),
      },
      include: {
        labels: true,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks", error);

    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, status, dueDate, labelIds } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || Priority.MEDIUM,
        status: status || Status.TODO,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: labelIds?.length
          ? {
              connect: labelIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        labels: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task", error);

    return NextResponse.json(
      {
        error: "Failed to create task",
      },
      { status: 500 }
    );
  }
}
