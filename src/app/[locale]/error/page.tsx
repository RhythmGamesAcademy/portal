import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, localizedPath, type Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return { title: getDictionary(value).metadata.errorTitle };
}

export default async function AuthErrorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const dictionary = getDictionary(locale);
  const { error } = await searchParams;
  const messages: Record<string, string> = {
    AccessDenied: dictionary.error.accessDenied,
    Configuration: dictionary.error.configuration,
    Verification: dictionary.error.verification,
  };

  return (
    <div className="panel max-w-2xl space-y-6">
      <p className="text-sm font-medium text-danger">{dictionary.error.kicker}</p>
      <h1 className="page-heading">{dictionary.error.title}</h1>
      <p className="text-muted">{(error && messages[error]) || dictionary.error.fallback}</p>
      <Link href={localizedPath(locale)} className="button button-primary w-full sm:w-auto">{dictionary.error.back}</Link>
    </div>
  );
}
