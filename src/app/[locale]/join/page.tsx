import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, localizedPath, type Locale } from "@/i18n/config";
import { optionalEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return { title: getDictionary(value).metadata.joinTitle };
}

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const dictionary = getDictionary(locale);
  const inviteUrl = optionalEnv("NEXT_PUBLIC_DISCORD_INVITE_URL");

  return (
    <div className="max-w-2xl space-y-8 sm:space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-medium text-warning">{dictionary.join.kicker}</p>
        <h1 className="page-heading">{dictionary.join.title}</h1>
        <p className="text-muted">{dictionary.join.description}</p>
      </section>

      <section className="panel space-y-5" aria-labelledby="join-steps-heading">
        <h2 id="join-steps-heading" className="section-heading">{dictionary.join.stepsHeading}</h2>
        <ol className="list-decimal space-y-3 pl-6 text-muted marker:text-accent marker:font-semibold">
          <li>{dictionary.join.stepJoin}</li>
          <li>{dictionary.join.stepReturn}</li>
        </ol>

        {inviteUrl ? (
          <a href={inviteUrl} className="button button-primary w-full sm:w-auto">{dictionary.join.invite}</a>
        ) : (
          <div className="notice-panel"><p className="text-muted">{dictionary.join.inviteMissing}</p></div>
        )}
      </section>

      <Link href={localizedPath(locale)} className="button">{dictionary.join.back}</Link>
    </div>
  );
}
