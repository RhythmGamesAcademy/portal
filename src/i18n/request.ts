import { cookies, headers } from "next/headers";
import { localeCookie, localeFromAcceptLanguage, isLocale, type Locale, defaultLocale } from "@/i18n/config";

export async function requestLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(localeCookie)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;
  return localeFromAcceptLanguage((await headers()).get("accept-language")) || defaultLocale;
}
