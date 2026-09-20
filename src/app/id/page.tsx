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

const STATUS_STYLE: Record<Student["status"], string> = {
  active: "text-success",
  suspended: "text-warning",
  withdrawn: "text-muted",
  expelled: "text-danger",
};

export default async function StudentIdPage() {
  const session = await auth();
  if (!session?.discordHash) redirect("/");

  const student = await findStudentByHash(session.discordHash);

  // 発行はサインイン時に完了しているため、ここで見つからないのは異常系
  if (!student) {
    return (
      <div className="panel max-w-2xl space-y-6">
        <p className="text-sm font-medium text-warning">記録の確認が必要です</p>
        <h1 className="page-heading">学籍を確認できません</h1>
        <p className="text-muted">
          学籍の記録を読み出せませんでした。一度ログアウトして、
          あらためてログインし直してください。
        </p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 sm:space-y-10">
      <section className="space-y-6" aria-labelledby="student-id-heading">
        <div className="space-y-3">
          <h1 id="student-id-heading" className="page-heading">学籍番号</h1>
          <p className="text-muted">発行済みの番号を確認・コピーできます。</p>
        </div>
        <div className="panel space-y-5">
          <p
            className="student-number"
            aria-label={`学籍番号 ${student.studentId.split("").join(" ")}`}
          >
            {student.studentId}
          </p>
          <CopyButton value={student.studentId} />
        </div>
      </section>

      <section className="panel space-y-4" aria-labelledby="student-info-heading">
        <h2 id="student-info-heading" className="section-heading">学籍情報</h2>
        <dl className="divide-y divide-line">
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-muted">発行日</dt>
            <dd>{formatDate(student.createdAt)}</dd>
          </div>
          <div className="grid items-start gap-2 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-muted">在籍状況</dt>
            <dd>
              <span className={`status-badge ${STATUS_STYLE[student.status]}`}>
                {STATUS_LABEL[student.status]}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel bg-notice" aria-labelledby="handling-heading">
        <h2 id="handling-heading" className="section-heading">取り扱いについて</h2>
        <p className="mt-3 text-muted">
          学籍番号は秘密情報ではありません。他の人に知られても差し支えありません。
          本人確認や認証に使う値ではなく、パスワードの代わりにはなりません。
        </p>
      </section>

      <div className="pt-2">
        <SignOutButton />
      </div>
    </div>
  );
}
