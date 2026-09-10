import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Home,
  MapPin,
  Maximize,
  Phone,
  Ruler,
  Truck,
  Wrench,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";
import { getMobilHomeBySlug, getPublishedMobilHomes } from "@/lib/data/mobilhomes";
import { getCompanySettings } from "@/lib/data/settings";
import { StatusBadge } from "@/components/mobilhomes/status-badge";
import { Gallery } from "@/components/mobilhomes/gallery";
import { ShareButtons } from "@/components/mobilhomes/share-buttons";
import { MobilHomeContactForm } from "@/components/mobilhomes/mobilhome-contact-form";
import { StickyMobileCta } from "@/components/mobilhomes/sticky-mobile-cta";
import { ExternalButtonLink } from "@/components/ui/button-link";
import { formatPrice, getDisplayPrice } from "@/lib/utils/price";
import { buildTelLink, buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { EQUIPMENT_KEYS, type MobilHome } from "@/types/mobilhome";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

async function loadData(locale: string, slug: string) {
  if (!isLocale(locale)) return null;
  const mobilHome = await getMobilHomeBySlug(locale, slug);
  if (!mobilHome) return null;
  const dict = await getDictionary(locale);
  return { mobilHome, dict, locale };
}

export async function generateMetadata(
  props: PageProps<"/[locale]/mobilhomes/[slug]">
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const data = await loadData(locale, slug);
  if (!data) return {};
  const { mobilHome } = data;
  const canonical = `/${locale}/mobilhomes/${slug}`;
  return {
    title: mobilHome.title[data.locale],
    description: mobilHome.shortDescription[data.locale],
    alternates: { canonical },
    openGraph: {
      title: mobilHome.title[data.locale],
      description: mobilHome.shortDescription[data.locale],
      images: mobilHome.images[0]?.url ? [mobilHome.images[0].url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const items = await getPublishedMobilHomes();
  return items.flatMap((m) =>
    (["fr", "es", "pt"] as Locale[]).map((locale) => ({
      locale,
      slug: m.slug[locale],
    }))
  );
}

function CharacteristicItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Home;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-3">
      <Icon className="h-5 w-5 shrink-0 text-brand-gold" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-brand-anthracite">{value}</p>
      </div>
    </div>
  );
}

export default async function MobilHomeDetailPage(
  props: PageProps<"/[locale]/mobilhomes/[slug]">
) {
  const { locale, slug } = await props.params;
  const data = await loadData(locale, slug);
  if (!data) notFound();
  const { mobilHome, dict } = data;
  const typedLocale = locale as Locale;

  const [settings] = await Promise.all([getCompanySettings()]);

  const { amount, vatLabel } = getDisplayPrice(mobilHome);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonicalUrl = `${siteUrl}/${locale}/mobilhomes/${slug}`;
  const whatsappMessage = t(dict.mobilhome.whatsappMessage, {
    reference: mobilHome.reference,
    title: mobilHome.title[typedLocale],
  });

  const deliveries: { key: keyof MobilHome; label: string }[] = [
    { key: "deliveryFrance", label: dict.footer.france },
    { key: "deliverySpain", label: dict.footer.spain },
    { key: "deliveryPortugal", label: dict.footer.portugal },
    { key: "deliveryEurope", label: "Europe" },
  ];
  const activeDeliveries = deliveries.filter((d) => mobilHome[d.key]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: mobilHome.title[typedLocale],
    description: mobilHome.shortDescription[typedLocale],
    image: mobilHome.images.map((i) => i.url),
    sku: mobilHome.reference,
    offers: {
      "@type": "Offer",
      price: amount,
      priceCurrency: mobilHome.currency,
      availability:
        mobilHome.status === "AVAILABLE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: canonicalUrl,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${locale}/mobilhomes`}
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-brand-anthracite"
      >
        ← {dict.mobilhome.backToCatalog}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Gallery images={mobilHome.images} title={mobilHome.title[typedLocale]} />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
                {dict.mobilhome.reference}: {mobilHome.reference}
              </p>
              <h1 className="mt-1 font-heading text-2xl font-bold text-brand-anthracite md:text-3xl">
                {mobilHome.title[typedLocale]}
              </h1>
            </div>
            <StatusBadge status={mobilHome.status} dict={dict} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {mobilHome.publicLocation}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>{dict.type[mobilHome.type]}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{dict.condition[mobilHome.condition]}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              {mobilHome.images.length}{" "}
              {mobilHome.images.length > 1 ? dict.mobilhome.photos : dict.mobilhome.photo}
            </span>
          </div>

          <Separator className="my-6" />

          <h2 className="mb-3 font-heading text-lg font-semibold text-brand-anthracite">
            {dict.mobilhome.characteristics}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <CharacteristicItem icon={Maximize} label={dict.mobilhome.surface} value={`${mobilHome.surface} m²`} />
            <CharacteristicItem icon={BedDouble} label={dict.mobilhome.bedrooms} value={mobilHome.bedrooms} />
            <CharacteristicItem icon={Home} label={dict.mobilhome.sleepingCapacity} value={mobilHome.sleepingCapacity} />
            <CharacteristicItem icon={Bath} label={dict.mobilhome.bathrooms} value={mobilHome.bathrooms} />
            <CharacteristicItem icon={Ruler} label={dict.mobilhome.year} value={mobilHome.year} />
            <CharacteristicItem icon={Wrench} label={dict.mobilhome.brand} value={`${mobilHome.brand} ${mobilHome.model}`} />
          </div>

          <Separator className="my-6" />

          <h2 className="mb-3 font-heading text-lg font-semibold text-brand-anthracite">
            {dict.mobilhome.description}
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {mobilHome.description[typedLocale]}
          </p>

          {mobilHome.equipment.length > 0 && (
            <>
              <Separator className="my-6" />
              <h2 className="mb-3 font-heading text-lg font-semibold text-brand-anthracite">
                {dict.mobilhome.equipment}
              </h2>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_KEYS.filter((key) => mobilHome.equipment.includes(key)).map(
                  (key) => (
                    <Badge key={key} variant="secondary" className="bg-brand-cream text-brand-anthracite">
                      {dict.equipmentLabels[key]}
                    </Badge>
                  )
                )}
              </div>
            </>
          )}

          {(activeDeliveries.length > 0 ||
            mobilHome.installationAvailable ||
            mobilHome.connectionAvailable) && (
            <>
              <Separator className="my-6" />
              <h2 className="mb-3 font-heading text-lg font-semibold text-brand-anthracite">
                {dict.mobilhome.delivery}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {activeDeliveries.length > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full bg-brand-blue-light px-3 py-1.5">
                    <Truck className="h-4 w-4 text-brand-anthracite" />
                    {dict.mobilhome.deliverableTo}{" "}
                    {activeDeliveries.map((d) => d.label).join(", ")}
                  </span>
                )}
                {mobilHome.installationAvailable && (
                  <span className="rounded-full bg-brand-blue-light px-3 py-1.5">
                    {dict.mobilhome.installation}
                  </span>
                )}
                {mobilHome.connectionAvailable && (
                  <span className="rounded-full bg-brand-blue-light px-3 py-1.5">
                    {dict.mobilhome.connection}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-brand-anthracite">
                {formatPrice(amount, mobilHome.currency)}
              </span>
              {vatLabel && (
                <span className="text-sm text-muted-foreground">{dict.mobilhome[vatLabel]}</span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <ExternalButtonLink href={buildTelLink(settings.phone)} className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90">
                <Phone className="h-4 w-4" /> {dict.mobilhome.call}
              </ExternalButtonLink>
              <ExternalButtonLink
                href={buildWhatsAppLink(settings.whatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-status-available text-white hover:bg-status-available/90"
              >
                {dict.mobilhome.whatsapp}
              </ExternalButtonLink>
              <ShareButtons url={canonicalUrl} title={mobilHome.title[typedLocale]} dict={dict} />
            </div>
          </div>

          <div id="contact-form" className="scroll-mt-24 rounded-xl border border-border bg-white p-5 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-brand-anthracite">
              {dict.mobilhome.contactTitle}
            </h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              {dict.mobilhome.contactSubtitle}
            </p>
            <MobilHomeContactForm
              dict={dict}
              mobileHomeId={mobilHome.id}
              mobileHomeReference={mobilHome.reference}
              defaultMessage={whatsappMessage}
            />
          </div>
        </div>
      </div>

      <StickyMobileCta
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        whatsappMessage={whatsappMessage}
        dict={dict}
      />
    </div>
  );
}
