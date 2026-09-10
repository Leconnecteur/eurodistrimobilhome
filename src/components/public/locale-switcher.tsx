"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  function pathForLocale(target: Locale): string {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="font-medium" />}
      >
        {LOCALE_LABELS[locale]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem key={l} render={<Link href={pathForLocale(l)} />}>
            {LOCALE_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
