import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCompanySettings } from "@/lib/data/settings";
import { PageBanner } from "@/components/public/page-banner";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  return {
    title: dict.legal.title,
    alternates: { canonical: `/${locale}/mentions-legales` },
    robots: { index: false },
  };
}

export default async function LegalPage(props: PageProps<"/[locale]/mentions-legales">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const [dict, settings] = await Promise.all([getDictionary(locale), getCompanySettings()]);

  return (
    <div>
      <PageBanner image="/images/hero.jpg" title={dict.legal.title} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-8 text-muted-foreground">{dict.legal.intro}</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Éditeur du site
          </h2>
          <p>{settings.companyName}</p>
          <p>{settings.address}</p>
          {settings.siret ? (
            <p>SIRET : {settings.siret}</p>
          ) : (
            <p className="italic text-status-reserved">
              SIRET à renseigner dans l&apos;administration (Paramètres).
            </p>
          )}
          <p>
            Téléphone : {settings.phone} — Email : {settings.email}
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Hébergement
          </h2>
          <p>
            Site hébergé par Vercel Inc. (visiteurs) et Google Cloud / Firebase (données et
            fichiers), 2 place Jussieu, 75005 Paris pour Vercel France, ou selon les mentions
            légales de ces prestataires disponibles sur leurs sites respectifs.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images, logo) est la
            propriété de {settings.companyName}, sauf mention contraire.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Conception et développement
          </h2>
          <p>
            Site conçu et développé par{" "}
            <a
              href="https://www.lcdstudio.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-anthracite underline-offset-2 hover:underline"
            >
              LCD Studio
            </a>
            .
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
