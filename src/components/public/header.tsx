import Link from "next/link";
import { Menu } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Logo } from "@/components/public/logo";
import { LocaleSwitcher } from "@/components/public/locale-switcher";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const nav = [
    { href: `/${locale}/mobilhomes`, label: dict.nav.mobilhomes },
    { href: `/${locale}/vendre-mon-mobilhome`, label: dict.nav.sell },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur supports-backdrop-blur:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo locale={locale} />

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-anthracite/80 transition-colors hover:text-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher locale={locale} />
          <ButtonLink
            href={`/${locale}/mobilhomes`}
            className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
          >
            {dict.nav.cta}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher locale={locale} />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Menu" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo locale={locale} />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="rounded-md px-3 py-3 text-base font-medium text-brand-anthracite hover:bg-muted"
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <Link
                      href={`/${locale}/mobilhomes`}
                      className="mt-2 rounded-md bg-brand-anthracite px-3 py-3 text-center text-base font-medium text-white"
                    />
                  }
                >
                  {dict.nav.cta}
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
