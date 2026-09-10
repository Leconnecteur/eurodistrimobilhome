import { z } from "zod";
import {
  EQUIPMENT_KEYS,
  LOCALES,
  MOBILHOME_CONDITIONS,
  MOBILHOME_STATUSES,
  MOBILHOME_TYPES,
} from "@/types/mobilhome";

export const MAX_MOBILHOME_IMAGES = 15;

const localizedTextSchema = z.object(
  Object.fromEntries(LOCALES.map((l) => [l, z.string().trim().max(5000)])) as Record<
    (typeof LOCALES)[number],
    z.ZodString
  >
);

export const mobilHomeFormSchema = z.object({
  brand: z.string().trim().min(1, "Marque requise").max(100),
  model: z.string().trim().min(1, "Modèle requis").max(100),
  year: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 1),
  type: z.enum(MOBILHOME_TYPES),
  condition: z.enum(MOBILHOME_CONDITIONS),
  status: z.enum(MOBILHOME_STATUSES),

  price: z.coerce.number().nonnegative(),
  priceHT: z.coerce.number().nonnegative().nullable().optional(),
  vatRate: z.coerce.number().min(0).max(100).nullable().optional(),
  priceTTC: z.coerce.number().nonnegative().nullable().optional(),
  currency: z.literal("EUR"),
  showPriceHT: z.boolean().default(false),
  showPriceTTC: z.boolean().default(true),

  surface: z.coerce.number().positive().max(300),
  length: z.coerce.number().positive().max(100).nullable().optional(),
  width: z.coerce.number().positive().max(20).nullable().optional(),
  height: z.coerce.number().positive().max(10).nullable().optional(),
  bedrooms: z.coerce.number().int().min(0).max(10),
  sleepingCapacity: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(10),
  toilets: z.coerce.number().int().min(0).max(10),
  masterBedroom: z.boolean().default(false),
  dressingRoom: z.boolean().default(false),
  livingRoom: z.boolean().default(true),
  kitchen: z.boolean().default(true),

  equipment: z.array(z.enum(EQUIPMENT_KEYS)).default([]),

  country: z.string().trim().min(1).max(100),
  region: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().max(20).optional().default(""),
  publicLocation: z.string().trim().min(1).max(150),

  deliveryFrance: z.boolean().default(false),
  deliverySpain: z.boolean().default(false),
  deliveryPortugal: z.boolean().default(false),
  deliveryEurope: z.boolean().default(false),
  installationAvailable: z.boolean().default(false),
  connectionAvailable: z.boolean().default(false),

  title: localizedTextSchema,
  shortDescription: localizedTextSchema,
  description: localizedTextSchema,

  published: z.boolean().default(false),
  archived: z.boolean().default(false),
});

export type MobilHomeFormValues = z.infer<typeof mobilHomeFormSchema>;
