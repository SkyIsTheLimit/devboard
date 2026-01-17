import type { CreateTaskDto, LabelDto, TaskDto, UpdateTaskDto } from "@/types";

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const api = {
  tasks: {
    list: async (filters?: {
      status?: string;
      priority?: string;
    }): Promise<TaskDto[]> => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);

      const url = `${API_BASE}/tasks${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url);
      return handleResponse<TaskDto[]>(response);
    },

    get: async (id: string): Promise<TaskDto> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`);
      return handleResponse<TaskDto>(response);
    },

    create: async (data: CreateTaskDto): Promise<TaskDto> => {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse<TaskDto>(response);
    },

    update: async (id: string, data: UpdateTaskDto): Promise<TaskDto> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse<TaskDto>(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
      });
      await handleResponse<{ success: boolean }>(response);
    },
  },

  labels: {
    list: async (): Promise<LabelDto[]> => {
      const response = await fetch(`${API_BASE}/labels`);
      return handleResponse<LabelDto[]>(response);
    },

    create: async (data: {
      name: string;
      color?: string;
    }): Promise<LabelDto> => {
      const response = await fetch(`${API_BASE}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse<LabelDto>(response);
    },
  },
};
