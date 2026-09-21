import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const dictionary = getDictionary(value);
  return { title: { default: dictionary.metadata.title, template: `%s | ${dictionary.metadata.title}` }, description: dictionary.metadata.description };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const dictionary = getDictionary(locale);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-ink">
        {dictionary.header.skipToContent}
      </a>
      <header className="border-b border-line bg-surface">
        <div className="portal-container flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <Link href={`/${locale}`} className="flex min-h-12 min-w-0 flex-1 flex-wrap items-center gap-3 rounded-lg transition-colors hover:text-accent">
            <Image src="/icon/rga-logo_w.svg" alt="" width={868} height={382} className="h-auto w-24 shrink-0 object-contain" priority />
            <span className="flex min-w-0 flex-col">
              <span className="text-base font-semibold">{dictionary.header.academyName}</span>
              <span className="text-sm text-muted">{dictionary.header.portalName}</span>
            </span>
          </Link>
          <LanguageSwitcher locale={locale} label={dictionary.header.language} ja={dictionary.header.ja} en={dictionary.header.en} />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="portal-container flex-1 py-8 sm:py-10">{children}</main>

      <footer className="border-t border-line">
        <div className="portal-container flex flex-col gap-2 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">{dictionary.header.academyName}</p>
          <nav aria-label={dictionary.header.relatedLinks} className="flex flex-wrap gap-x-5">
            <a href="https://rga-forms-portal.vercel.app" className="text-link">{dictionary.header.formsPortal}</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
