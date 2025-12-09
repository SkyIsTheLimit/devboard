import { Card } from "@devboard-interactive/ui";

export function Empty() {
  return (
    <Card className="w-3/4 bg-card text-card-foreground">
      <p className="text-center py-8">
        No tasks found. Create your first task!
      </p>
    </Card>
  );
}
