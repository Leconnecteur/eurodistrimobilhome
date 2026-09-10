import { z } from "zod";

export const contactSubjectSchema = z.enum([
  "GENERAL",
  "MOBILHOME_AVAILABLE",
  "SELL_MOBILHOME",
  "DELIVERY",
  "OTHER",
]);

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court").max(100),
  email: z.string().trim().email("Email invalide").max(150),
  phone: z.string().trim().min(6, "Numéro invalide").max(30),
  subject: contactSubjectSchema,
  message: z.string().trim().min(10, "Message trop court").max(2000),
  // honeypot field - must remain empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const mobilHomeContactSchema = z.object({
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().min(5).max(2000),
  mobileHomeId: z.string().min(1),
  mobileHomeReference: z.string().min(1),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type MobilHomeContactValues = z.infer<typeof mobilHomeContactSchema>;
