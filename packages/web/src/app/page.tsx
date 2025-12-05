import { TasksContainer } from "@/components/TasksContainer";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-primary-muted-2400 text-primary-muted-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">DevBoard</h1>

        <TasksContainer />
      </div>
    </main>
  );
}
