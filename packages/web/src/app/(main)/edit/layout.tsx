export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      Edit Layout
      {children}
    </div>
  );
}
