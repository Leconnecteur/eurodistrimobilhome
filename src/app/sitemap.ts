import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { getPublishedMobilHomes } from "@/lib/data/mobilhomes";

const STATIC_PATHS = [
  "",
  "/mobilhomes",
  "/vendre-mon-mobilhome",
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/politique-confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const mobilHomes = await getPublishedMobilHomes();

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    }))
  );

  const mobilHomeEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    mobilHomes.map((m) => ({
      url: `${siteUrl}/${locale}/mobilhomes/${m.slug[locale]}`,
      lastModified: new Date(m.updatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    }))
  );

  return [...staticEntries, ...mobilHomeEntries];
}
