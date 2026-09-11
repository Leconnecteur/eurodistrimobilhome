import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const LOGO_RATIO = 449 / 334;

export function Logo({
  locale,
  className,
  variant = "default",
  height = 44,
}: {
  locale: Locale;
  className?: string;
  variant?: "default" | "mono-light";
  height?: number;
}) {
  return (
    <Link
      href={`/${locale}`}
      className={`flex items-center gap-2 ${className ?? ""}`}
    >
      <Image
        src="/brand/logo-trimmed.png"
        alt="Euro Distri Mobilhome"
        width={Math.round(height * LOGO_RATIO)}
        height={height}
        priority
        className={variant === "mono-light" ? "brightness-0 invert" : ""}
      />
    </Link>
  );
}
