import { redirect } from "next/navigation";
import { localizedPath } from "@/i18n/config";
import { requestLocale } from "@/i18n/request";

export const dynamic = "force-dynamic";

export default async function LegacyErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const query = error ? `?error=${encodeURIComponent(error)}` : "";
  redirect(`${localizedPath(await requestLocale(), "error")}${query}`);
}
