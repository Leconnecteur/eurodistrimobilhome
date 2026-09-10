export type MobilHomeStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type MobilHomeType = "USED" | "NEW";
export type MobilHomeCondition =
  | "EXCELLENT"
  | "VERY_GOOD"
  | "GOOD"
  | "TO_RENOVATE";

export const MOBILHOME_STATUSES: MobilHomeStatus[] = [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
];
export const MOBILHOME_TYPES: MobilHomeType[] = ["USED", "NEW"];
export const MOBILHOME_CONDITIONS: MobilHomeCondition[] = [
  "EXCELLENT",
  "VERY_GOOD",
  "GOOD",
  "TO_RENOVATE",
];

export const EQUIPMENT_KEYS = [
  "airConditioning",
  "heating",
  "oven",
  "hobs",
  "fridge",
  "dishwasher",
  "washingMachine",
  "microwave",
  "television",
  "terrace",
  "coveredTerrace",
  "furnished",
  "awning",
  "shutters",
  "doubleGlazing",
] as const;

export type EquipmentKey = (typeof EQUIPMENT_KEYS)[number];

export type Locale = "fr" | "es" | "pt";
export const LOCALES: Locale[] = ["fr", "es", "pt"];
export const DEFAULT_LOCALE: Locale = "fr";

export type LocalizedText = Record<Locale, string>;

export interface MobilHomeImage {
  url: string;
  storagePath: string;
  alt: string;
  order: number;
}

export interface MobilHome {
  id: string;
  reference: string; // e.g. EDM-2026-001
  slug: Record<Locale, string>;

  brand: string;
  model: string;
  year: number;
  type: MobilHomeType;
  condition: MobilHomeCondition;
  status: MobilHomeStatus;

  // Pricing
  price: number;
  priceHT: number | null;
  vatRate: number | null;
  priceTTC: number | null;
  currency: "EUR";
  showPriceHT: boolean;
  showPriceTTC: boolean;

  // Characteristics
  surface: number; // m2
  length: number | null; // m
  width: number | null; // m
  height: number | null; // m
  bedrooms: number;
  sleepingCapacity: number;
  bathrooms: number;
  toilets: number;
  masterBedroom: boolean;
  dressingRoom: boolean;
  livingRoom: boolean;
  kitchen: boolean;

  equipment: EquipmentKey[];

  // Location
  country: string;
  region: string;
  city: string;
  postalCode: string;
  publicLocation: string;

  // Delivery
  deliveryFrance: boolean;
  deliverySpain: boolean;
  deliveryPortugal: boolean;
  deliveryEurope: boolean;
  installationAvailable: boolean;
  connectionAvailable: boolean;

  images: MobilHomeImage[];

  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;

  published: boolean;
  archived: boolean;

  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export type MobilHomeInput = Omit<
  MobilHome,
  "id" | "reference" | "createdAt" | "updatedAt" | "slug"
>;

export interface MobilHomeFilters {
  brand?: string;
  bedrooms?: number;
  minSurface?: number;
  maxSurface?: number;
  minPrice?: number;
  maxPrice?: number;
  country?: string;
  city?: string;
  status?: MobilHomeStatus;
  year?: number;
  type?: MobilHomeType;
  equipment?: EquipmentKey[];
  sort?: "price-asc" | "price-desc" | "recent" | "surface-desc";
  page?: number;
}
