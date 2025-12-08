import { Header } from "@/components/header";
import { Tasks } from "@/molecules/tasks";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-primary-muted-2400 text-primary-muted-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <Header />
        <Tasks />
      </div>
    </main>
  );
}
