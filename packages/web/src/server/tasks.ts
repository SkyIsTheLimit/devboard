"use server";

import { Status, TaskDto, UpdateTaskDto } from "@/types";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { withAuth } from "./with-auth";

export const createTask = withAuth(async ({ userId }, formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
});

export const getTasks = withAuth(
  async ({ userId }, status?: Status): Promise<TaskDto[]> => {
    const tasks: TaskDto[] = await prisma.task.findMany({
      where: { AND: [{ userId }, { deletedAt: null }, status ? { status } : {}] },
      include: { labels: true },
      orderBy: { updatedAt: "desc" },
    });

    return tasks;
  },
);

export const updateTask = withAuth(async ({ userId }, task: UpdateTaskDto) => {
  const updatedTask = await prisma.task.update({
    where: { id: task.id, userId, deletedAt: null },
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
});

export const cloneTask = withAuth(async ({ userId }, taskId: string) => {
  const existingTask = await prisma.task.findUnique({
    where: {
      id: taskId,
      userId,
      deletedAt: null,
    },
    include: {
      labels: true,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  const newTask = await prisma.task.create({
    data: {
      title: existingTask.title,
      description: existingTask.description,
      userId,
      labels: {
        connect: existingTask.labels.map((label) => ({ id: label.id })),
      },
    },
  });

  revalidatePath("/");
  return { id: newTask.id, title: newTask.title };
});

export const deleteTask = withAuth(async ({ userId }, taskId: string) => {
  await prisma.task.update({
    where: { id: taskId, userId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/");
});

export const restoreTask = withAuth(async ({ userId }, taskId: string) => {
  await prisma.task.update({
    where: { id: taskId, userId },
    data: { deletedAt: null },
  });

  revalidatePath("/");
});

export const hardDeleteTask = withAuth(async ({ userId }, taskId: string) => {
  await prisma.task.delete({
    where: { id: taskId, userId },
  });

  revalidatePath("/");
});
