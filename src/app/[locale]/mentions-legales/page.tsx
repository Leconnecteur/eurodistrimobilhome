import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCompanySettings } from "@/lib/data/settings";

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-3xl font-bold text-brand-anthracite">
        {dict.legal.title}
      </h1>
      <p className="mb-8 text-muted-foreground">{dict.legal.intro}</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Éditeur du site
          </h2>
          <p>{settings.companyName}</p>
          <p>{settings.address}</p>
          {settings.siret && <p>SIRET : {settings.siret}</p>}
          <p>
            Téléphone : {settings.phone} — Email : {settings.email}
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Hébergement
          </h2>
          <p>Le site est hébergé par Vercel Inc.</p>
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
      </div>
    </div>
  );
}
