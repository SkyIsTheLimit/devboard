"use server";

import { Status, TaskDto, UpdateTaskDto } from "@/types";

import { prisma } from "@/lib/prisma";
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
      where: { AND: [{ userId }, status ? { status } : {}] },
      include: { labels: true },
    });

    return tasks;
  },
);

export const updateTask = withAuth(async ({ userId }, task: UpdateTaskDto) => {
  const updatedTask = await prisma.task.update({
    where: { id: task.id, userId },
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
    },
    include: {
      labels: true,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  await prisma.task.create({
    data: {
      title: existingTask.title,
      description: existingTask.description,
      userId,
      labels: {
        connect: existingTask.labels.map((label) => ({ id: label.id })),
      },
    },
  });
});

export const deleteTask = withAuth(async ({ userId }, taskId: string) => {
  await prisma.task.delete({
    where: { id: taskId, userId },
  });
});
