import type { Metadata } from "next";
import { AboutHero } from "@/components/pages/about/about-hero";
import { AboutFeatures } from "@/components/pages/about/about-features";
import { AboutCTA } from "@/components/pages/about/about-cta";
import Lenis from "@/components/Lenis";

export const metadata: Metadata = {
  title: "About Feedoise | Multilingual Feedback & Ticketing Platform",
  description:
    "Feedoise is a centralized feedback management tool where teams handle multiple projects and users submit feedback in any language - with light ticketing features for workflow management.",
  keywords: [
    "feedback management",
    "multilingual feedback",
    "ticketing system",
    "project management",
    "customer feedback",
    "translation",
    "collaboration tool",
  ],
  openGraph: {
    title: "About Feedoise | Multilingual Feedback & Ticketing Platform",
    description:
      "Centralized feedback management with multilingual support and light ticketing features for workflow management.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Feedoise | Multilingual Feedback & Ticketing Platform",
    description:
      "Centralized feedback management with multilingual support and light ticketing features.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Lenis />
      <AboutHero />
      <AboutFeatures />
      <AboutCTA />
    </main>
  );
}
