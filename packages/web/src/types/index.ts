import {
  Label as PrismaLabel,
  Priority as PrismaPriority,
  Status as PrismaStatus,
  Task as PrismaTask,
} from "@/generated/prisma/client";

export type Status = PrismaStatus;
export type Priority = PrismaPriority;

export type LabelDto = Pick<PrismaLabel, "id" | "name" | "color"> & {
  _count?: {
    tasks: number;
  };
};
export type TaskDto = PrismaTask & {
  labels: LabelDto[];
};

export type CreateTaskDto = {
  title: TaskDto["title"];
  status: TaskDto["status"];
  labelIds?: string[];
} & Partial<
  Omit<
    TaskDto,
    "id" | "title" | "status" | "labels" | "createdAt" | "updatedAt"
  >
>;

export type UpdateTaskDto = Pick<TaskDto, "id"> &
  Partial<
    Pick<
      TaskDto,
      "title" | "description" | "status" | "priority" | "dueDate"
    > & {
      labelIds: string[];
    }
  >;
