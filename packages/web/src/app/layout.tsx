import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import type { Metadata } from "next";

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
  console.log("Layout", { filter });
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen flex flex-col">
          <Header>{filter}</Header>
          {children}
        </main>
      </body>
    </html>
  );
}
