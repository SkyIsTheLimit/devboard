import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevBoard",
  description: "A modern task management platform.",
};

export default function RootLayout({
  children,
  filter,
}: Readonly<{
  children: React.ReactNode;
  filter: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <main className="min-h-screen flex flex-col">
            <Header>{filter}</Header>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
