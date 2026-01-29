import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "./user-button";
import header from "../app/header.png";
import { auth } from "@/auth";

interface HeaderProps {
  children?: React.ReactNode;
}

export async function Header({ children }: HeaderProps) {
  const session = await auth();
  
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
            {session?.user && <UserButton user={session.user} />}
        </Container>
      </div>

      {children}
    </div>
  );
}
