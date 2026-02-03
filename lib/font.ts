import { Noto_Sans, Noto_Sans_Arabic, Noto_Sans_SC } from "next/font/google";

const notoSans = Noto_Sans({
  subsets: ["latin-ext", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"], // it does not have chinese subset sadly. Using latin to ensure english characters work well
  variable: "--font-chinese",
  display: "swap",
  weight: ["400", "500", "700"],
});

export { notoSans, notoSansArabic, notoSansSC };
