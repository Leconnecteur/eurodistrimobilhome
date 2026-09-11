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
    <div>
      <PageBanner image="/images/hero.jpg" title={dict.privacy.title} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-8 text-muted-foreground">{dict.privacy.intro}</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données collectées sur ce site est{" "}
            {settings.companyName}, {settings.address}, contact :{" "}
            <a href={`mailto:${settings.email}`} className="hover:text-brand-anthracite">
              {settings.email}
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Données collectées
          </h2>
          <p>
            Lorsque vous remplissez un formulaire de contact, de demande d&apos;information ou de
            reprise de mobil-home, nous collectons votre nom, prénom, email, téléphone, ainsi que
            les informations relatives à votre demande (et, pour une reprise, jusqu&apos;à 4
            photos de votre mobil-home).
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Finalité et base légale
          </h2>
          <p>
            Ces données sont utilisées exclusivement par {settings.companyName} afin de traiter
            votre demande, vous recontacter et, le cas échéant, établir une offre commerciale.
            Le traitement repose sur l&apos;intérêt légitime de {settings.companyName} à répondre
            aux demandes qui lui sont adressées. Elles ne sont jamais revendues à des tiers.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Durée de conservation
          </h2>
          <p>
            Les données sont conservées le temps nécessaire au traitement de votre demande, puis
            archivées ou supprimées conformément aux durées légales applicables (notamment en
            matière commerciale et comptable).
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Hébergement des données
          </h2>
          <p>
            Les données et photos sont hébergées via les services Google Cloud / Firebase, et le
            site est hébergé par Vercel Inc. Ces prestataires appliquent leurs propres mesures de
            sécurité et peuvent, selon les cas, traiter des données en dehors de l&apos;Union
            Européenne dans le cadre de garanties appropriées (clauses contractuelles types).
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de
            suppression et d&apos;opposition concernant vos données. Pour l&apos;exercer,
            contactez-nous à l&apos;adresse{" "}
            <a href={`mailto:${settings.email}`} className="hover:text-brand-anthracite">
              {settings.email}
            </a>
            . Vous pouvez également introduire une réclamation auprès de la CNIL (France),
            l&apos;AEPD (Espagne) ou la CNPD (Portugal) selon votre pays de résidence.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-heading text-base font-semibold text-brand-anthracite">
            Cookies
          </h2>
          <p>
            Ce site n&apos;utilise pas de cookies publicitaires. Seuls des cookies techniques
            strictement nécessaires au fonctionnement du site peuvent être déposés.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
