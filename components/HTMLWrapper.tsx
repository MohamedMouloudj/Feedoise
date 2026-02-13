"use client";

import { notoSans, notoSansArabic, notoSansSC } from "@/lib/font";
import { useLingoContext } from "@lingo.dev/compiler/react";
import Footer from "./layout/footer";

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
        {children}
        <Footer />
      </body>
    </html>
  );
}
