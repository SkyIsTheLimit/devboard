import type { Task, Label, CreateTaskInput, UpdateTaskInput } from "@/types";

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
    }): Promise<Task[]> => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);

      const url = `${API_BASE}/tasks${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url);
      return handleResponse<Task[]>(response);
    },

    get: async (id: string): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`);
      return handleResponse<Task>(response);
    },

    create: async (data: CreateTaskInput): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse<Task>(response);
    },

    update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse<Task>(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
      });
      await handleResponse<{ success: boolean }>(response);
    },
  },

  labels: {
    list: async (): Promise<Label[]> => {
      const response = await fetch(`${API_BASE}/labels`);
      return handleResponse<Label[]>(response);
    },

    create: async (data: { name: string; color?: string }): Promise<Label> => {
      const response = await fetch(`${API_BASE}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse<Label>(response);
    },
  },
};
