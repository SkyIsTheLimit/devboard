"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { createTask } from "@/server/tasks";
import { taskCreateSchema } from "@/lib/validations/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@devboard-interactive/ui/dialog";
import { Input } from "@devboard-interactive/ui/input";
import { Label } from "@devboard-interactive/ui/label";
import { Textarea } from "@devboard-interactive/ui/textarea";
import { Button } from "@devboard-interactive/ui/button";
import { useRouter } from "next/navigation";

interface TaskCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskCreateDialog({ open, onOpenChange }: TaskCreateDialogProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onChange: taskCreateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        formData.append("title", value.title);
        formData.append("description", value.description || "");

        await createTask(formData);

        toast.success("Task created successfully");
        onOpenChange(false);
        form.reset();
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create task");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  autoFocus
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter task title"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter task description (optional)"
                  rows={4}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
