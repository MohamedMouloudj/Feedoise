"use client";

import { useLingoContext } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLingoContext();

  return (
    <select
      value={locale}
      onChange={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLocale(e.target.value as any);
        window.location.reload();
      }}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
      <option value="pt">Português</option>
      <option value="ru">Русский</option>
      <option value="zh">中文</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
}
