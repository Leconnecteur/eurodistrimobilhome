import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getFeaturedMobilHomes } from "@/lib/data/mobilhomes";
import { getCompanySettings } from "@/lib/data/settings";
import { MobilHomeCard } from "@/components/mobilhomes/mobilhome-card";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button-link";
import { buildTelLink, buildWhatsAppLink } from "@/lib/utils/whatsapp";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  return {
    title: dict.home.heroTitle,
    description: dict.home.heroSubtitle,
    alternates: { canonical: `/${locale}` },
  };
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();

  const [dict, mobilHomes, settings] = await Promise.all([
    getDictionary(locale),
    getFeaturedMobilHomes(6),
    getCompanySettings(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-anthracite text-white">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-28 sm:px-6 md:py-36 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-light">
            France · España · Portugal
          </p>
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight md:text-6xl">
            {dict.home.heroTitle}
          </h1>
          <p className="max-w-xl text-lg text-white/80">{dict.home.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonLink
              href={`/${locale}/mobilhomes`}
              size="lg"
              className="bg-brand-gold text-brand-anthracite hover:bg-brand-gold-light"
            >
              {dict.home.ctaDiscover}
              <ArrowRight className="ml-1 h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href={`/${locale}/vendre-mon-mobilhome`}
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              {dict.home.ctaSell}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Available mobilhomes */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold text-brand-anthracite">
              {dict.home.availableTitle}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {dict.home.availableSubtitle}
            </p>
          </div>
          <ButtonLink href={`/${locale}/mobilhomes`} variant="ghost" className="shrink-0">
            {dict.home.viewAll}
            <ArrowRight className="ml-1 h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mobilHomes.map((m) => (
            <MobilHomeCard key={m.id} mobilHome={m} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      {/* Buyback process */}
      <section className="bg-brand-cream/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-anthracite">
              {dict.home.buybackTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">{dict.home.buybackSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: dict.home.step1Title, text: dict.home.step1Text },
              { title: dict.home.step2Title, text: dict.home.step2Text },
              { title: dict.home.step3Title, text: dict.home.step3Text },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-lg border border-brand-gold/20 bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-lg font-semibold text-brand-anthracite">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink
              href={`/${locale}/vendre-mon-mobilhome`}
              size="lg"
              className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
            >
              {dict.home.ctaSell}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* European presence */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold text-brand-anthracite">
              {dict.home.europeTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">{dict.home.europeSubtitle}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[dict.footer.france, dict.footer.spain, dict.footer.portugal].map(
              (country) => (
                <div
                  key={country}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border bg-brand-blue-light/60 p-6 text-center"
                >
                  <MapPin className="h-6 w-6 text-brand-gold" />
                  <span className="text-sm font-semibold text-brand-anthracite">
                    {country}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="bg-brand-anthracite py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            {dict.home.contactTitle}
          </h2>
          <p className="max-w-xl text-white/70">{dict.home.contactSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <ExternalButtonLink
              href={buildTelLink(settings.phone)}
              size="lg"
              className="bg-brand-gold text-brand-anthracite hover:bg-brand-gold-light"
            >
              <Phone className="mr-1 h-4 w-4" /> {settings.phone}
            </ExternalButtonLink>
            <ExternalButtonLink
              href={buildWhatsAppLink(settings.whatsapp, "Bonjour, je souhaite des informations.")}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
            </ExternalButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
