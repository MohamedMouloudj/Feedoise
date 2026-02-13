"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useGSAP, gsap } from "@/lib/gsap";

export function AboutHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window !== "undefined") {
        window.addEventListener("load", () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(".about-badge", {
            y: -30,
            opacity: 0,
            duration: 0.6,
          })
            .from(
              ".about-title",
              {
                y: 50,
                opacity: 0,
                duration: 0.8,
              },
              "-=0.3",
            )
            .from(
              ".about-subtitle",
              {
                y: 30,
                opacity: 0,
                duration: 0.6,
              },
              "-=0.4",
            );
        });
      }
    },
    { scope: heroRef, revertOnUpdate: true },
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background px-4 py-24 sm:py-32"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl text-center">
        <div className="about-badge mb-6 inline-block">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            About Feedoise
          </Badge>
        </div>

        <h1 className="about-title mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Feedback Management,{" "}
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Globally Accessible
          </span>
        </h1>

        <p className="about-subtitle mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A centralized feedback management tool where teams handle multiple
          projects and users submit feedback in any language - with light
          ticketing features for workflow management.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
