import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils"; // or use template literals if you don't have cn

type LogoVariant = "default" | "negative" | "dark";
type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  href?: string;
  priority?: boolean;
  responsive?: boolean; // Enables responsive sizing
}

const LOGO_VARIANTS: Record<LogoVariant, string> = {
  default: "/logo.svg",
  negative: "/logo-negative.svg",
  dark: "/logo-dark.svg",
};

const LOGO_SIZES: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 60, height: 27 },
  md: { width: 110, height: 40 },
  lg: { width: 170, height: 53 },
  xl: { width: 230, height: 67 },
};

/**
 * Logo component that supports multiple variants and sizes. It can be used as a link or a static image.
 * @param variant - The variant of the logo, either "default", "negative", or "dark".
 * @param size - The size of the logo, can be "sm", "md", "lg", or "xl".
 * @param className - Additional CSS classes to apply to the logo.
 * @param href - If provided, the logo will act as a link to this URL.
 * @param priority - Whether the image should be prioritized for loading.
 * @param responsive - Whether the logo should be responsive.
 * @returns The rendered logo component.
 */
export function Logo({
  variant = "default",
  size = "md",
  className,
  href = "/",
  priority = false,
  responsive = false,
}: LogoProps) {
  const { width, height } = LOGO_SIZES[size];
  const logoSrc = LOGO_VARIANTS[variant];

  const responsiveClasses = responsive
    ? "w-[100px] h-auto sm:w-[120px] md:w-[150px] lg:w-[180px]"
    : "";

  const logo = (
    <Image
      src={logoSrc}
      alt="Feedoise Logo"
      width={width}
      height={height}
      priority={priority}
      className={cn(responsiveClasses, "object-contain")}
      sizes={
        responsive
          ? "(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 150px, 180px"
          : undefined
      }
    />
  );

  if (!href) {
    return <div className={cn("flex items-center", className)}>{logo}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center", className)}>
      {logo}
    </Link>
  );
}
