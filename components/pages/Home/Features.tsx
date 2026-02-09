"use client";

import { featureCards } from "@/config/static-data";
import { useLingoContext } from "@lingo.dev/compiler/react";
import { useMemo } from "react";

export default function Features() {
  const { locale } = useLingoContext();
  const localizedFeatures = useMemo(() => {
    return (
      featureCards[locale as keyof typeof featureCards] || featureCards["en"]
    );
  }, [locale]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {Object.entries(localizedFeatures).map(([key, feature]) => (
        <FeatureCard
          key={key}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-background border border-border">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
