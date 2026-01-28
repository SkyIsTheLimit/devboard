import { Session } from "next-auth";
import { auth } from "@/auth";

export function withAuth<T extends unknown[], R>(
  handler: (
    context: {
      userId: Session["user"]["id"];
      user: Session["user"];
      expires: Session["expires"];
    },
    ...args: T
  ) => Promise<R>,
) {
  return async (...args: T): Promise<R> => {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }
    return handler(
      {
        userId: session.user.id,
        user: session.user,
        expires: session.expires,
      },
      ...args,
    );
  };
}
