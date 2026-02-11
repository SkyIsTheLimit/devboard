"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { updateTask } from "@/server/tasks";
import { TaskDto, LabelDto, Status, Priority } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@devboard-interactive/ui/sheet";
import { Input } from "@devboard-interactive/ui/input";
import { Label } from "@devboard-interactive/ui/label";
import { Textarea } from "@devboard-interactive/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@devboard-interactive/ui/select";
import { Button } from "@devboard-interactive/ui/button";
import { Calendar } from "@devboard-interactive/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@devboard-interactive/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@devboard-interactive/ui/command";
import { Badge } from "@devboard-interactive/ui/badge";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Loader2, CalendarIcon, XIcon, TagIcon, CheckIcon } from "lucide-react";
import { format } from "date-fns";

interface TaskEditSheetProps {
  task: TaskDto | null;
  initialLabels: LabelDto[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export function TaskEditSheet({ task, initialLabels, open, onOpenChange, onSave }: TaskEditSheetProps) {
  const router = useRouter();
  const [savingField, setSavingField] = useState<string | null>(null);
  const availableLabels = initialLabels;
  const [labelsOpen, setLabelsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "TODO",
      priority: task?.priority || "MEDIUM",
      dueDate: task?.dueDate || null,
      labelIds: task?.labels?.map((l) => l.id) || [],
    },
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      form.setFieldValue("title", task.title);
      form.setFieldValue("description", task.description || "");
      form.setFieldValue("status", task.status);
      form.setFieldValue("priority", task.priority);
      form.setFieldValue("dueDate", task.dueDate || null);
      form.setFieldValue("labelIds", task.labels?.map((l) => l.id) || []);
    }
  }, [task?.id]);

  const handleAutoSave = useCallback(
    async (fieldName: string, value: string | Date | null | string[] | Status | Priority) => {
      if (!task) return;

      setSavingField(fieldName);
      try {
        const updateData: {
          id: string;
          title?: string;
          description?: string | null;
          status?: Status;
          priority?: Priority;
          dueDate?: Date | null;
          labelIds?: string[];
        } = {
          id: task.id,
        };

        // Handle different field types
        if (fieldName === "description") {
          updateData.description = value === "" ? null : (value as string);
        } else if (fieldName === "dueDate") {
          updateData.dueDate = value as Date | null;
        } else if (fieldName === "labelIds") {
          updateData.labelIds = value as string[];
        } else if (fieldName === "title") {
          updateData.title = value as string;
        } else if (fieldName === "status") {
          updateData.status = value as Status;
        } else if (fieldName === "priority") {
          updateData.priority = value as Priority;
        }

        await updateTask(updateData);

        router.refresh();
        onSave?.();

        // Show subtle success feedback
        const fieldLabels: Record<string, string> = {
          title: "Title",
          description: "Description",
          status: "Status",
          priority: "Priority",
          dueDate: "Due date",
          labelIds: "Labels",
        };
        // toast.success(`${fieldLabels[fieldName]} updated`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Failed to update ${fieldName}`);
      } finally {
        setSavingField(null);
      }
    },
    [task, router, onSave],
  );

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 p-4">
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-title">Title *</Label>
                  {savingField === "title" && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="edit-title"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={async () => {
                    field.handleBlur();
                    if (field.state.value.trim()) {
                      await handleAutoSave("title", field.state.value);
                    }
                  }}
                  placeholder="Enter task title"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-description">Description</Label>
                  {savingField === "description" && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                <Textarea
                  id="edit-description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={async () => {
                    field.handleBlur();
                    await handleAutoSave("description", field.state.value);
                  }}
                  placeholder="Enter task description"
                  rows={6}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-status">Status</Label>
                  {savingField === "status" && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                <Select
                  value={field.state.value}
                  onValueChange={async (value) => {
                    const newStatus = value as Status;
                    field.handleChange(newStatus);
                    await handleAutoSave("status", newStatus);
                  }}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="priority">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-priority">Priority</Label>
                  {savingField === "priority" && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                <Select
                  value={field.state.value}
                  onValueChange={async (value) => {
                    const newPriority = value as Priority;
                    field.handleChange(newPriority);
                    await handleAutoSave("priority", newPriority);
                  }}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="dueDate">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  {savingField === "dueDate" && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-dueDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.state.value
                        ? format(new Date(field.state.value), "PPP")
                        : "No due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.state.value ? new Date(field.state.value) : undefined}
                      onSelect={async (date) => {
                        field.handleChange(date || null);
                        await handleAutoSave("dueDate", date || null);
                      }}
                    />
                    {field.state.value && (
                      <div className="border-t p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={async () => {
                            field.handleChange(null);
                            await handleAutoSave("dueDate", null);
                          }}
                        >
                          <XIcon className="mr-2 h-4 w-4" />
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </form.Field>

          <form.Field name="labelIds">
            {(field) => {
              const selectedLabels = availableLabels.filter((label) =>
                field.state.value.includes(label.id)
              );

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-labels">Labels</Label>
                    {savingField === "labelIds" && (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <Popover open={labelsOpen} onOpenChange={setLabelsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="edit-labels"
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-auto min-h-10"
                      >
                        <TagIcon className="mr-2 h-4 w-4 shrink-0" />
                        <div className="flex flex-wrap gap-1 flex-1">
                          {selectedLabels.length > 0 ? (
                            selectedLabels.map((label) => (
                              <Badge
                                key={label.id}
                                variant="secondary"
                                style={{
                                  backgroundColor: label.color + "20",
                                  borderColor: label.color,
                                  color: label.color,
                                }}
                              >
                                {label.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">No labels</span>
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search labels..." />
                        <CommandList>
                          <CommandEmpty>No labels found.</CommandEmpty>
                          <CommandGroup>
                            {availableLabels.map((label) => {
                              const isSelected = field.state.value.includes(label.id);
                              return (
                                <CommandItem
                                  key={label.id}
                                  value={label.name}
                                  onSelect={async () => {
                                    const newValue = isSelected
                                      ? field.state.value.filter((id) => id !== label.id)
                                      : [...field.state.value, label.id];
                                    field.handleChange(newValue);
                                    await handleAutoSave("labelIds", newValue);
                                  }}
                                >
                                  <div
                                    className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary"
                                    style={{
                                      backgroundColor: isSelected ? label.color : "transparent",
                                      borderColor: label.color,
                                    }}
                                  >
                                    {isSelected && (
                                      <CheckIcon className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    style={{
                                      backgroundColor: label.color + "20",
                                      borderColor: label.color,
                                      color: label.color,
                                    }}
                                  >
                                    {label.name}
                                  </Badge>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            }}
          </form.Field>
        </div>

        <div className="pt-4 border-t mt-auto p-4">
          <p className="text-sm text-muted-foreground">
            Changes are saved automatically when you move to another field.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
