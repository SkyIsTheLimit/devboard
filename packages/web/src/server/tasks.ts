"use server";

import { Status, TaskDto, UpdateTaskDto } from "@/types";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createTask(formData: FormData) {
  const session = await auth();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.task.create({
    data: {
      title,
      description,
      userId: session?.user.id,
    },
  });
}

export async function getTasks(status?: Status): Promise<TaskDto[]> {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const tasks: TaskDto[] = await prisma.task.findMany({
    where: { AND: [{ userId: session.user.id }, status ? { status } : {}] },
    include: { labels: true },
  });

  return tasks;
}

export async function updateTask(task: UpdateTaskDto) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id, userId: session.user.id },
    data: {
      ...task,
      labels: task.labelIds
        ? {
            set: task.labelIds.map((id) => ({ id })),
          }
        : undefined,
    },
  });

  return updatedTask;
}

export async function deleteTask(taskId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id },
  });
}
