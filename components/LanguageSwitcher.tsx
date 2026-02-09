"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLingoContext } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLingoContext();

  return (
    <Select
      value={locale || "en"}
      onValueChange={(value) => {
        setLocale(value as Parameters<typeof setLocale>[0]);
        window.location.reload();
      }}
      defaultValue="en"
    >
      <SelectTrigger className="w-22 h-8 px-2 text-sm rounded-md border border-border bg-background focus:ring-2 focus:ring-primary">
        <SelectValue placeholder="EN" />
      </SelectTrigger>
      <SelectContent className="w-20 rounded-md bg-background border border-border shadow-md text-sm z-100">
        <SelectItem value="en" className="py-1 px-2">
          English
        </SelectItem>
        <SelectItem value="ar" className="py-1 px-2">
          العربية
        </SelectItem>
        <SelectItem value="fr" className="py-1 px-2">
          Français
        </SelectItem>
        <SelectItem value="es" className="py-1 px-2">
          Español
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
