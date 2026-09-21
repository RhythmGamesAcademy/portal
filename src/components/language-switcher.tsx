"use client";

import { usePathname } from "next/navigation";
import { switchLocalePath, type Locale, localeCookie } from "@/i18n/config";

export function LanguageSwitcher({ locale, label, ja, en }: { locale: Locale; label: string; ja: string; en: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const targetLocale = locale === "ja" ? "en" : "ja";
  const target = switchLocalePath(targetLocale, pathname);
  const targetLabel = targetLocale === "ja" ? ja : en;

  function rememberLocale() {
    document.cookie = `${localeCookie}=${targetLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <nav aria-label={label} className="flex min-h-11 items-center gap-2 text-sm">
      <span className="text-muted">{label}:</span>
      <span aria-current="page" className="font-medium text-ink">{locale === "ja" ? ja : en}</span>
      <span aria-hidden="true" className="text-muted">/</span>
      <a href={target} onClick={rememberLocale} className="text-link min-h-11 px-1">
        {targetLabel}
      </a>
    </nav>
  );
}
