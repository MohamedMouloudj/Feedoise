import Image from "next/image";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className || ""}`}>
      <Image
        src="/logo-negative.png"
        alt="Feedoise Logo"
        width={150}
        height={40}
        priority
      />
    </Link>
  );
}
