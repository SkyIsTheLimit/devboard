import { auth, signOut } from "@/auth";

import { Button } from "@devboard-interactive/ui";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import header from "../app/header.png";

export async function Header({ children }: { children?: React.ReactNode }) {
  const session = await auth();

  console.log("Header", { children });

  return (
    <div className="sticky top-0 z-10 dark dark:bg-neutral-900 text-white">
      <div className="border-b py-8 ">
        <Container className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image src={header} alt="Devboard logo" width={32} height={32} />
              <h1 className="text-lg font-bold">DevBoard</h1>
            </div>
          </Link>
          {session?.user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
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
        </Container>
      </div>

      {children}
    </div>
  );
}
