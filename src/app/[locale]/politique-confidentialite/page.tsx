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
    title: dict.privacy.title,
    alternates: { canonical: `/${locale}/politique-confidentialite` },
    robots: { index: false },
  };
}

export default async function PrivacyPage(
  props: PageProps<"/[locale]/politique-confidentialite">
) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const [dict, settings] = await Promise.all([getDictionary(locale), getCompanySettings()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-3xl font-bold text-brand-anthracite">
        {dict.privacy.title}
      </h1>
      <p className="mb-8 text-muted-foreground">{dict.privacy.intro}</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Données collectées
          </h2>
          <p>
            Lorsque vous remplissez un formulaire de contact, de demande d&apos;information ou de
            reprise de mobil-home, nous collectons votre nom, prénom, email, téléphone, ainsi que
            les informations relatives à votre demande.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Utilisation des données
          </h2>
          <p>
            Ces données sont utilisées exclusivement par {settings.companyName} afin de traiter
            votre demande et de vous recontacter. Elles ne sont jamais revendues à des tiers.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et
            de suppression de vos données. Pour l&apos;exercer, contactez-nous à l&apos;adresse{" "}
            {settings.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
