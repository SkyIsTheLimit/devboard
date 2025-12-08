import { TaskModel } from "@/generated/prisma/models";

export type Status = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Label {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  labels: Label[];
}

export type CreateTaskPayload = {
  title: Task["title"];
  status: Task["status"];
  labelIds?: string[];
} & Partial<
  Omit<Task, "id" | "title" | "status" | "labels" | "createdAt" | "updatedAt">
>;

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: Date;
  labelIds?: string[];
}
