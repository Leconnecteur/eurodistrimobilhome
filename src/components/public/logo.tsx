import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export function Logo({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Link
      href={`/${locale}`}
      className={`flex items-center gap-2 font-heading font-bold tracking-tight ${className ?? ""}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-anthracite text-brand-gold-light">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 12l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 11v7a1 1 0 001 1h12a1 1 0 001-1v-7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 19v-4h6v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-sm text-brand-anthracite">EURO DISTRI</span>
        <span className="block text-xs font-medium tracking-widest text-brand-gold">
          MOBILHOME
        </span>
      </span>
    </Link>
  );
}
