import type { Metadata } from "next";
import { LingoProvider } from "@lingo.dev/compiler/react";
import HTMLWrapper from "@/components/HTMLWrapper";
import Navbar from "@/components/layout/app-navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feedoise - Multilingual Feedback Platform",
  description:
    "Collect and manage feedback in any language. A modern ticketing platform for global teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LingoProvider>
      <HTMLWrapper>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
        <Toaster />
      </HTMLWrapper>
    </LingoProvider>
  );
}
