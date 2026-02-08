import { ReactNode } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonProps = {
  type?:
    | "primary"
    | "secondary"
    | "primary-submit"
    | "secondary-submit"
    | "destructive"
    | "destructive-submit"
    | "outline"
    | "ghost";
  children?: ReactNode;
  className?: string;
  href?: string;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
};

/**
 * Reusable button component that can be used throughout the application.
 * It supports different types, sizes, and can be used as a link or a regular button
 *
 * @param children - The content of the button.
 * @param className - Additional CSS classes to apply to the button.
 * @param type - The type of button, either "primary", "secondary", "primary-submit", "secondary-submit", "destructive", "destructive-submit", "outline", or "ghost". defaults to "primary".
 * @param href - If provided, the button will act as a link to this URL.
 * @param size - The size of the button, can be "sm", "default", "lg", "icon", "icon-sm", or "icon-lg".
 * @param icon - An icon to display inside the button.
 * @param onClick - A function to call when the button is clicked.
 * @param disabled - Whether the button is disabled.
 * @return The rendered button component.
 *
 * */
function AppButton({
  children,
  className = "",
  type = "primary",
  size,
  href = "",
  icon,
  onClick,
  disabled = false,
  dir,
}: ButtonProps) {
  return (
    <ShadcnButton
      className={cn(
        "flex-center cursor-pointer font-medium transition-all",
        className,
      )}
      variant={
        type === "primary" || type === "primary-submit"
          ? "default"
          : type === "secondary" || type === "secondary-submit"
            ? "secondary"
            : type === "destructive" || type === "destructive-submit"
              ? "destructive"
              : type
      }
      onClick={onClick}
      disabled={disabled}
      type={
        type === "primary-submit" ||
        type === "secondary-submit" ||
        type === "destructive-submit"
          ? "submit"
          : "button"
      }
      size={size}
      dir={dir}
    >
      {href ? <Link href={href}>{children}</Link> : children} {icon}
    </ShadcnButton>
  );
}

export default AppButton;
