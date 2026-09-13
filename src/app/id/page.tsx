import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CopyButton } from "@/components/copy-button";
import { SignOutButton } from "@/components/sign-out-button";
import { formatDate } from "@/lib/format";
import { findStudentByHash } from "@/services/students";
import type { Student } from "@/db/schema";

export const metadata: Metadata = { title: "学籍番号" };

// セッションを読むためリクエストごとに描画する
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUS_LABEL: Record<Student["status"], string> = {
  active: "在籍",
  suspended: "活動停止",
  withdrawn: "退会",
  expelled: "除名",
};

export default async function StudentIdPage() {
  const session = await auth();
  if (!session?.discordHash) redirect("/");

  const student = await findStudentByHash(session.discordHash);

  // 発行はサインイン時に完了しているため、ここで見つからないのは異常系
  if (!student) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl tracking-wide">学籍を確認できません</h1>
        <p className="text-sm leading-loose text-muted">
          学籍の記録を読み出せませんでした。一度ログアウトして、
          あらためてログインし直してください。
        </p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <h1 className="font-serif text-xl tracking-wide">学籍番号</h1>

        <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
          <p
            className="font-mono text-[2rem] leading-tight font-medium tracking-[0.18em] break-all tabular-nums sm:text-5xl"
            aria-label={`学籍番号 ${student.studentId.split("").join(" ")}`}
          >
            {student.studentId}
          </p>
          <div className="mt-6">
            <CopyButton value={student.studentId} />
          </div>
        </div>

        <p className="text-sm leading-loose text-muted">
          講義のレポート提出時などに使う番号です。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg tracking-wide">学籍情報</h2>
        <dl className="divide-y divide-line border-y border-line text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">発行日</dt>
            <dd className="text-right">{formatDate(student.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">入学コホート</dt>
            <dd className="text-right font-mono tracking-wider tabular-nums">
              {student.enteredCohort}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">在籍状況</dt>
            <dd
              className={`text-right ${student.status === "active" ? "" : "text-danger"}`}
            >
              {STATUS_LABEL[student.status]}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg bg-notice p-5">
        <h2 className="font-serif text-base tracking-wide">取り扱いについて</h2>
        <p className="mt-2 text-sm leading-loose text-muted">
          学籍番号は秘密情報ではありません。成績台帳の見出しとして用いる番号であり、
          他の学生や講師に知られても差し支えありません。
          パスワードの代わりとして用いることはできません。
        </p>
      </section>

      <div className="pt-2">
        <SignOutButton />
      </div>
    </div>
  );
}
