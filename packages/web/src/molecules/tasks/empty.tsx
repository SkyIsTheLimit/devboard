import { Card } from "@/components/ui/card";

export function Empty() {
  return (
    <Card color="primary" className="w-3/4 bg-card text-card-foreground">
      <p className=" text-center py-8">
        No tasks found. Create your first task!
      </p>
    </Card>
  );
}
