"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { notoSans, notoSansArabic, notoSansSC } from "@/lib/font";
import { useLingoContext } from "@lingo.dev/compiler/react";

export default function HTMLWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLingoContext().locale;
  const isRTL = locale === "ar";
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSansArabic.variable} ${notoSansSC.variable} antialiased`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <LanguageSwitcher />
        {children}
      </body>
    </html>
  );
}
