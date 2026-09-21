import { redirect } from "next/navigation";
import { localizedPath } from "@/i18n/config";
import { requestLocale } from "@/i18n/request";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  redirect(localizedPath(await requestLocale()));
}
