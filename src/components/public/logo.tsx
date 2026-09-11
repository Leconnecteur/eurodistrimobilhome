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
  variant?: "default" | "on-dark";
  height?: number;
}) {
  const image = (
    <Image
      src="/brand/logo-trimmed.png"
      alt="Euro Distri Mobilhome"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      priority
    />
  );

  return (
    <Link
      href={`/${locale}`}
      className={`flex items-center gap-2 ${className ?? ""}`}
    >
      {variant === "on-dark" ? (
        <span className="rounded-lg bg-white/95 px-3 py-2 shadow-sm">{image}</span>
      ) : (
        image
      )}
    </Link>
  );
}
