import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { StudentIdView } from "@/components/student-id-view";
import { SignOutButton } from "@/components/sign-out-button";
import { findStudentByHash } from "@/services/students";

export const metadata: Metadata = { title: "学籍番号" };

// セッションを読むためリクエストごとに描画する
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function StudentIdPage() {
  const session = await auth();
  if (!session?.discordHash) redirect("/");

  const student = await findStudentByHash(session.discordHash);

  // 発行はサインイン時に完了しているため、見つからない場合は再ログインを案内する
  return <StudentIdView student={student} signOut={<SignOutButton />} />;
}
