import { auth, signOut } from "@/auth";
import { Button } from "@devboard-interactive/ui";

export async function Header() {
  const session = await auth();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-lg font-bold">Dev Board</h1>
      {session?.user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-primary-muted-400">
              {session.user.name || session.user.email}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/signin" });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Sign Out
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
