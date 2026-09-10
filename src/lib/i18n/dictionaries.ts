import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  fr: () => import("@/translations/fr.json").then((m) => m.default),
  es: () => import("@/translations/es.json").then((m) => m.default),
  pt: () => import("@/translations/pt.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["fr"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.fr;
  return loader();
}
