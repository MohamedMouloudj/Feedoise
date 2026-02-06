import type { Metadata } from "next";
import { LingoProvider } from "@lingo.dev/compiler/react";
import HTMLWrapper from "@/components/HTMLWrapper";
import Navbar from "@/components/layout/app-navbar";
import AppSidebar from "@/components/layout/app-sidebar";
import Footer from "@/components/layout/footer";
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
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1">{children}</main>
          </div>
          <Footer />
        </div>
        <Toaster />
      </HTMLWrapper>
    </LingoProvider>
  );
}
