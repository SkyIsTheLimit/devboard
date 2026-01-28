import { cn } from "@/lib/utils";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("max-w-4xl mx-auto px-4 lg:px-0", className)}>
    {children}
  </div>
);
