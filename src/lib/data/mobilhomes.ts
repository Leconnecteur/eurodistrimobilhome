import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { MOCK_MOBILHOMES } from "@/lib/data/mock-mobilhomes";
import { getCompanySettings } from "@/lib/data/settings";
import type { Locale, MobilHome, MobilHomeFilters } from "@/types/mobilhome";

/**
 * Public, read-only data access for the storefront. Uses the Firestore client
 * SDK from Server Components (no admin credentials needed): access is
 * enforced by Firestore Security Rules (only `published` mobil-homes are
 * readable by anyone). Falls back to demo data until Firebase is configured.
 */

async function fetchAllMobilHomes(): Promise<MobilHome[]> {
  if (!isFirebaseConfigured) return MOCK_MOBILHOMES;
  try {
    const db = getFirebaseDb();
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.mobilhomes), where("published", "==", true))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MobilHome);
  } catch (error) {
    console.error("Failed to fetch mobilhomes from Firestore", error);
    return MOCK_MOBILHOMES;
  }
}

export async function getPublishedMobilHomes(
  filters: MobilHomeFilters = {}
): Promise<MobilHome[]> {
  const [all, settings] = await Promise.all([fetchAllMobilHomes(), getCompanySettings()]);
  let items = all.filter(
    (m) =>
      m.published &&
      !m.archived &&
      (settings.showSoldMobilHomes || m.status !== "SOLD")
  );

  if (filters.brand) items = items.filter((m) => m.brand === filters.brand);
  if (filters.country) items = items.filter((m) => m.country === filters.country);
  if (filters.city) items = items.filter((m) => m.city === filters.city);
  if (filters.status) items = items.filter((m) => m.status === filters.status);
  if (filters.type) items = items.filter((m) => m.type === filters.type);
  if (filters.year) items = items.filter((m) => m.year === filters.year);
  if (filters.bedrooms != null)
    items = items.filter((m) => m.bedrooms >= filters.bedrooms!);
  if (filters.minSurface != null)
    items = items.filter((m) => m.surface >= filters.minSurface!);
  if (filters.maxSurface != null)
    items = items.filter((m) => m.surface <= filters.maxSurface!);
  if (filters.minPrice != null)
    items = items.filter((m) => m.price >= filters.minPrice!);
  if (filters.maxPrice != null)
    items = items.filter((m) => m.price <= filters.maxPrice!);
  if (filters.equipment?.length)
    items = items.filter((m) =>
      filters.equipment!.every((eq) => m.equipment.includes(eq))
    );

  switch (filters.sort) {
    case "price-asc":
      items = items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items = items.sort((a, b) => b.price - a.price);
      break;
    case "surface-desc":
      items = items.sort((a, b) => b.surface - a.surface);
      break;
    default:
      items = items.sort((a, b) => b.createdAt - a.createdAt);
  }

  return items;
}

export async function getFeaturedMobilHomes(count = 6): Promise<MobilHome[]> {
  const items = await getPublishedMobilHomes({ sort: "recent" });
  return items.filter((m) => m.status === "AVAILABLE").slice(0, count);
}

export async function getMobilHomeBySlug(
  locale: Locale,
  slug: string
): Promise<MobilHome | null> {
  const [items, settings] = await Promise.all([fetchAllMobilHomes(), getCompanySettings()]);
  const found = items.find(
    (m) =>
      m.published &&
      !m.archived &&
      m.slug[locale] === slug &&
      (settings.showSoldMobilHomes || m.status !== "SOLD")
  );
  return found ?? null;
}

export async function getMobilHomeById(id: string): Promise<MobilHome | null> {
  if (!isFirebaseConfigured) {
    return MOCK_MOBILHOMES.find((m) => m.id === id) ?? null;
  }
  try {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, COLLECTIONS.mobilhomes, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as MobilHome;
  } catch (error) {
    console.error("Failed to fetch mobilhome", error);
    return null;
  }
}

export function getDistinctBrands(items: MobilHome[]): string[] {
  return Array.from(new Set(items.map((m) => m.brand))).sort();
}

export function getDistinctCountries(items: MobilHome[]): string[] {
  return Array.from(new Set(items.map((m) => m.country))).sort();
}

// Re-exported for admin usage that needs the raw (unfiltered) list count, etc.
export { fsLimit, orderBy };
