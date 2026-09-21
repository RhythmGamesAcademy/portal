import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";
import { getDictionary } from "@/i18n";
import { isLocale, localizedPath, type Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const dictionary = getDictionary(value);
  return { title: dictionary.home.title, description: dictionary.metadata.description };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const dictionary = getDictionary(locale);
  if (await auth()) redirect(localizedPath(locale, "id"));

  return (
    <div className="max-w-2xl space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <h1 className="page-heading">{dictionary.home.title}</h1>
        <p className="text-muted">{dictionary.home.description}</p>
      </div>

      <section className="panel space-y-6" aria-labelledby="login-heading">
        <div className="space-y-3">
          <h2 id="login-heading" className="section-heading">{dictionary.home.loginHeading}</h2>
          <p className="text-muted">{dictionary.home.loginDescription}</p>
        </div>
        <div className="space-y-3 border-l-2 border-accent pl-4">
          <p>{dictionary.home.firstLogin}</p>
          <p className="text-muted">{dictionary.home.laterLogin}</p>
        </div>
        <SignInButton redirectTo={localizedPath(locale, "id")} label={dictionary.home.signIn} pendingLabel={dictionary.home.signInPending} />
        <p className="text-sm text-muted">{dictionary.home.privacy}</p>
      </section>
    </div>
  );
}
