import type { Locale } from "@/i18n/config";

export function formatDate(value: Date | string, locale: Locale): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00+09:00`) : value;
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(date);
}
