import { Header } from "@/components/header";

export default function MainLayout({
  children,
  filter,
}: Readonly<{
  children: React.ReactNode;
  filter: React.ReactNode;
}>) {
  return (
    <>
      <Header>{filter}</Header>
      {children}
    </>
  );
}
