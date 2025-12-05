"use client";

import { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@devboard-interactive/ui";
import { api } from "@/lib/api";
import type { Label, Priority, CreateTaskInput } from "@/types";

interface CreateTaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTaskForm({ onSuccess, onCancel }: CreateTaskFormProps) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTaskInput>({
    title: "",
    description: "",
    priority: "MEDIUM",
    labelIds: [],
  });

  useEffect(() => {
    api.labels.list().then(setLabels).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.tasks.create(formData);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  function toggleLabel(labelId: string) {
    setFormData((prev) => ({
      ...prev,
      labelIds: prev.labelIds?.includes(labelId)
        ? prev.labelIds.filter((id) => id !== labelId)
        : [...(prev.labelIds || []), labelId],
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-primary-muted-2500 p-6 my-4 rounded-md"
    >
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Input
        label="Title"
        placeholder="What needs to be done?"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Textarea
        label="Description (optional)"
        placeholder="Add more details..."
        rows={3}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value as Priority })
          }
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-muted-500"
        >
          <option className={`bg-primary-muted-2200`} value="LOW">
            Low
          </option>
          <option className={`bg-primary-muted-2200`} value="MEDIUM">
            Medium
          </option>
          <option className={`bg-primary-muted-2200`} value="HIGH">
            High
          </option>
          <option className={`bg-primary-muted-2200`} value="URGENT">
            Urgent
          </option>
        </select>
      </div>

      {labels.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleLabel(label.id)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  formData.labelIds?.includes(label.id) ? "" : "opacity-50"
                }`}
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  borderColor: label.color,
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading}>
          Create Task
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
