"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { featureTranslations, featuresIcons } from "@/config/static-data";
import { useLingoContext } from "@lingo.dev/compiler/react";

export function AboutFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { locale } = useLingoContext();

  useGSAP(
    () => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "expo.out",
        });
      });
    },
    {
      scope: sectionRef,
      revertOnUpdate: true,
    },
  );

  return (
    <section ref={sectionRef} className="px-4 py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Core Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to manage feedback across multiple projects with
            teams from around the world.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featureTranslations[locale].map((feature, index) => {
            const Icon = featuresIcons[feature.id];
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group relative overflow-hidden rounded-xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>

                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
