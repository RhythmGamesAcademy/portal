export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";
export const localeCookie = "portal-locale";

export function isLocale(value: string | undefined): value is Locale {
  return value === "ja" || value === "en";
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return defaultLocale;
  const languages = value
    .split(",")
    .map((part) => ({
      language: part.trim().split(";", 1)[0]?.toLowerCase() ?? "",
      quality: Number(part.match(/;q=([0-9.]+)/i)?.[1] ?? "1"),
    }))
    .filter((part) => part.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of languages) {
    if (language === "ja" || language.startsWith("ja-")) return "ja";
    if (language === "en" || language.startsWith("en-")) return "en";
  }
  return defaultLocale;
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalized = path === "/" ? "" : path.replace(/^\/+/, "");
  return `/${locale}${normalized ? `/${normalized}` : ""}`;
}

export function switchLocalePath(locale: Locale, pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "ja" || segments[0] === "en") segments.shift();
  return localizedPath(locale, segments.join("/"));
}
