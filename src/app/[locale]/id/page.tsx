import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { StudentIdView } from "@/components/student-id-view";
import { SignOutButton } from "@/components/sign-out-button";
import { getDictionary } from "@/i18n";
import { isLocale, localizedPath, type Locale } from "@/i18n/config";
import { DiscordApiError, getAcademyRoleIdsWithBot } from "@/lib/discord";
import { optionalEnv } from "@/lib/env";
import { rolesFromDiscordIds, unavailableRoleSnapshot } from "@/lib/roles";
import { findStudentByHash } from "@/services/students";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return { title: getDictionary(value).metadata.idTitle };
}

export default async function StudentIdPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const dictionary = getDictionary(locale);
  const session = await auth();
  if (!session?.discordHash) redirect(localizedPath(locale));
  const student = await findStudentByHash(session.discordHash);
  let roles = session.roles ?? unavailableRoleSnapshot();
  const canEditRoles = Boolean(session.discordUserId && optionalEnv("DISCORD_BOT_TOKEN"));
  if (canEditRoles) {
    try {
      roles = rolesFromDiscordIds(await getAcademyRoleIdsWithBot(session.discordUserId));
    } catch (error) {
      if (!(error instanceof DiscordApiError)) throw error;
      console.error("Failed to load Discord roles for the student ID page.", error);
      roles = unavailableRoleSnapshot();
    }
  }

  return (
    <StudentIdView
      student={student}
      locale={locale}
      dictionary={dictionary}
      roles={roles}
      canEditRoles={canEditRoles && roles.rolesAvailable}
      signOut={<SignOutButton redirectTo={localizedPath(locale)} label={dictionary.id.signOut} pendingLabel={dictionary.id.signOutPending} />}
    />
  );
}
