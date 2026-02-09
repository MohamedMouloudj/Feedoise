"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageBadgeProps {
  language: string;
  showingOriginal: boolean;
  onToggle: () => void;
  size?: "sm" | "default";
}

// Language code to name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ar: "Arabic",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  pt: "Portuguese",
  ru: "Russian",
  it: "Italian",
  hi: "Hindi",
};

export function LanguageBadge({
  language,
  showingOriginal,
  onToggle,
  size = "default",
}: LanguageBadgeProps) {
  const languageName = LANGUAGE_NAMES[language] || language.toUpperCase();

  return (
    <Button
      variant={showingOriginal ? "secondary" : "ghost"}
      size={size === "sm" ? "sm" : "default"}
      onClick={onToggle}
      className={cn("gap-1.5", size === "sm" && "h-7 text-xs")}
      title={`Originally in ${languageName}. Click to ${showingOriginal ? "show translation" : "show original"}`}
    >
      <Globe className={cn("h-3.5 w-3.5", size === "sm" && "h-3 w-3")} />
      {language.toUpperCase()}
    </Button>
  );
}
