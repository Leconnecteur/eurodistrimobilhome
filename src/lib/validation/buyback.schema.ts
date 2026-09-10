import { z } from "zod";

export const MAX_BUYBACK_IMAGES = 4;

export const buybackFormSchema = z.object({
  brand: z.string().trim().min(1, "Marque requise").max(100),
  model: z.string().trim().min(1, "Modèle requis").max(100),
  year: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 1),
  surface: z.coerce.number().positive().max(200),
  bedrooms: z.coerce.number().int().min(0).max(10),
  bathrooms: z.coerce.number().int().min(0).max(10),
  city: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  condition: z.enum(["EXCELLENT", "VERY_GOOD", "GOOD", "TO_RENOVATE"]),
  description: z.string().trim().min(10).max(2000),
  desiredPrice: z.coerce.number().nonnegative().optional().nullable(),
  terrace: z.boolean().default(false),
  airConditioning: z.boolean().default(false),
  heating: z.boolean().default(false),
  furnished: z.boolean().default(false),
  otherEquipment: z.string().trim().max(500).optional().default(""),

  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional().default(""),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(6).max(30),
  sellerCountry: z.string().trim().min(1).max(100),
  sellerCity: z.string().trim().min(1).max(100),
  consent: z.literal(true, "Vous devez accepter d'être recontacté."),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type BuybackFormValues = z.infer<typeof buybackFormSchema>;
