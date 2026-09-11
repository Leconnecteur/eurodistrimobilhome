import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/public/social-icons";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CompanySettings } from "@/types/settings";
import { Logo } from "@/components/public/logo";

export function Footer({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: CompanySettings;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-brand-anthracite text-white/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo locale={locale} variant="on-dark" height={36} />
          <p className="max-w-xs text-sm text-white/60">{dict.footer.tagline}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold-light">
            {dict.footer.navigation}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`/${locale}/mobilhomes`} className="hover:text-white">
                {dict.nav.mobilhomes}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/vendre-mon-mobilhome`} className="hover:text-white">
                {dict.nav.sell}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/a-propos`} className="hover:text-white">
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="hover:text-white">
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold-light">
            {dict.footer.countries}
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{dict.footer.france}</li>
            <li>{dict.footer.spain}</li>
            <li>{dict.footer.portugal}</li>
          </ul>

          <h3 className="mt-6 mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold-light">
            {dict.footer.legal}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`/${locale}/mentions-legales`} className="hover:text-white">
                {dict.footer.legalMentions}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/politique-confidentialite`} className="hover:text-white">
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Administration
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold-light">
            {dict.contact.infoTitle}
          </h3>
          <p className="flex items-start gap-2 text-white/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
            {settings.address}
          </p>
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-2 hover:text-white"
          >
            <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
            {settings.phone}
          </a>
          <a
            href={`mailto:${settings.email}`}
            className="flex items-center gap-2 hover:text-white"
          >
            <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
            {settings.email}
          </a>
          <div className="flex items-center gap-3 pt-2">
            {settings.socialLinks.facebook && (
              <a href={settings.socialLinks.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="h-5 w-5 text-white/70 hover:text-brand-gold" />
              </a>
            )}
            {settings.socialLinks.instagram && (
              <a href={settings.socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="h-5 w-5 text-white/70 hover:text-brand-gold" />
              </a>
            )}
            {settings.socialLinks.linkedin && (
              <a href={settings.socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-5 w-5 text-white/70 hover:text-brand-gold" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} {settings.companyName}. {dict.footer.rights}
        {" — "}
        Site réalisé par{" "}
        <a
          href="https://www.lcdstudio.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 underline-offset-2 hover:text-brand-gold-light hover:underline"
        >
          LCD Studio
        </a>
      </div>
    </footer>
  );
}
