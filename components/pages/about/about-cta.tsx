"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import AppButton from "@/components/AppButton";

export function AboutCTA() {
  const ctaRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (typeof window !== "undefined") {
        window.addEventListener("load", () => {
          gsap.from(".about-cta-content", {
            scrollTrigger: {
              trigger: ".about-cta-content",
              start: "top bottom-=100",
              toggleActions: "play none none none",
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      }
      return () => null;
    },
    { scope: ctaRef, revertOnUpdate: true },
  );

  return (
    <section id="about-cta" ref={ctaRef} className="px-4 py-24 sm:py-32">
      <div className="container mx-auto max-w-5xl">
        <div className="about-cta-content relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/10 via-primary/5 to-background p-12 text-center">
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Join teams worldwide who are managing feedback seamlessly across
              languages and time zones.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <AppButton
                size="lg"
                className="gap-2"
                href="/signup"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Create Free Account
              </AppButton>
              <AppButton type="secondary" size="lg" href="/projects">
                Browse Public Projects
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
