import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/types/mobilhome";

export { LOCALES, DEFAULT_LOCALE };
export type { Locale };

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "FR",
  es: "ES",
  pt: "PT",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  fr: "Français",
  es: "Español",
  pt: "Português",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function localeOrDefault(value: string | undefined): Locale {
  if (value && isLocale(value)) return value;
  return DEFAULT_LOCALE;
}
