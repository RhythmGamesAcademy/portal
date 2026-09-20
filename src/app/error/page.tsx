import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ログインできませんでした" };

const MESSAGES: Record<string, string> = {
  // ギルド未参加は /join へ送るため、ここに来るのは所属確認や発行処理が失敗した場合
  AccessDenied:
    "ログインを完了できませんでした。学園の Discord サーバーに参加しているか確認のうえ、時間をおいて再度お試しください。",
  Configuration:
    "学園ポータルの設定に不備があります。時間をおいて再度お試しください。",
  Verification: "ログインの有効期限が切れています。もう一度お試しください。",
};

const FALLBACK =
  "ログイン処理の途中で問題が発生しました。時間をおいて再度お試しください。";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="panel max-w-2xl space-y-6">
      <p className="text-sm font-medium text-danger">ログインが完了していません</p>
      <h1 className="page-heading">ログインできませんでした</h1>
      <p className="text-muted">
        {(error && Object.hasOwn(MESSAGES, error) && MESSAGES[error]) || FALLBACK}
      </p>
      <Link
        href="/"
        className="button button-primary w-full sm:w-auto"
      >
        入口に戻る
      </Link>
    </div>
  );
}
