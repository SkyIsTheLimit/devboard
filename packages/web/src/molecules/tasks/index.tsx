import { TasksContainer } from "./container";
import { TasksProvider } from "./context";

export * from "./container";
export * from "./form";
export * from "./list";
export * from "./status-filter";
export * from "./task";

export const Tasks = () => (
  <TasksProvider>
    <TasksContainer />
  </TasksProvider>
);
