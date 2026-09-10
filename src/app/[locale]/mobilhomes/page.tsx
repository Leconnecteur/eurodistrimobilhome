import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";
import {
  getDistinctBrands,
  getDistinctCountries,
  getPublishedMobilHomes,
} from "@/lib/data/mobilhomes";
import { MobilHomeCard } from "@/components/mobilhomes/mobilhome-card";
import { CatalogFilters } from "@/components/mobilhomes/catalog-filters";
import type {
  EquipmentKey,
  MobilHomeFilters,
  MobilHomeStatus,
  MobilHomeType,
} from "@/types/mobilhome";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  return {
    title: dict.catalog.title,
    description: dict.catalog.subtitle,
    alternates: { canonical: `/${locale}/mobilhomes` },
  };
}

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>
): MobilHomeFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const getAll = (key: string): string[] => {
    const v = searchParams[key];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  return {
    brand: get("brand") || undefined,
    country: get("country") || undefined,
    status: (get("status") as MobilHomeStatus) || undefined,
    type: (get("type") as MobilHomeType) || undefined,
    bedrooms: get("bedrooms") ? Number(get("bedrooms")) : undefined,
    minSurface: get("minSurface") ? Number(get("minSurface")) : undefined,
    maxSurface: get("maxSurface") ? Number(get("maxSurface")) : undefined,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    equipment: getAll("equipment") as EquipmentKey[],
    sort: (get("sort") as MobilHomeFilters["sort"]) || "recent",
  };
}

export default async function CatalogPage(props: PageProps<"/[locale]/mobilhomes">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const searchParams = await props.searchParams;

  const [dict, allPublished] = await Promise.all([
    getDictionary(locale),
    getPublishedMobilHomes({ sort: "recent" }),
  ]);

  const filters = parseFilters(searchParams);
  const query = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)
    ?.toLowerCase()
    .trim();

  let items = await getPublishedMobilHomes(filters);
  if (query) {
    items = items.filter((m) =>
      `${m.brand} ${m.model} ${m.title[locale]} ${m.city}`
        .toLowerCase()
        .includes(query)
    );
  }

  const brands = getDistinctBrands(allPublished);
  const countries = getDistinctCountries(allPublished);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-brand-anthracite md:text-4xl">
          {dict.catalog.title}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{dict.catalog.subtitle}</p>
      </div>

      <CatalogFilters dict={dict} brands={brands} countries={countries} />

      <p className="mb-4 mt-6 text-sm text-muted-foreground">
        {t(dict.catalog.resultsCount, { count: items.length })}
      </p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-20 text-center text-muted-foreground">
          {dict.catalog.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <MobilHomeCard key={m.id} mobilHome={m} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
