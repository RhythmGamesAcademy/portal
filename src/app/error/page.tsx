import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ログインできませんでした" };

const MESSAGES: Record<string, string> = {
  // ギルド未参加は /join へ送るため、ここに来るのは所属確認や発行処理が失敗した場合
  AccessDenied:
    "ログインを完了できませんでした。学園の Discord サーバーに参加しているか確認のうえ、時間をおいて再度お試しください。",
  Configuration:
    "学務ポータルの設定に不備があります。時間をおいて再度お試しください。",
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
    <div className="space-y-6">
      <h1 className="font-serif text-2xl tracking-wide">ログインできませんでした</h1>
      <p className="text-base leading-loose text-muted">
        {(error && MESSAGES[error]) || FALLBACK}
      </p>
      <Link
        href="/"
        className="inline-block text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink"
      >
        入口に戻る
      </Link>
    </div>
  );
}
