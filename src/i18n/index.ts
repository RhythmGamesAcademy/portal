import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { ja } from "@/i18n/dictionaries/ja";
import type { Dictionary } from "@/i18n/dictionaries/types";

const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
