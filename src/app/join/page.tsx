import type { Metadata } from "next";
import Link from "next/link";
import { optionalEnv } from "@/lib/env";

export const metadata: Metadata = { title: "Discord サーバーへの参加" };

export default function JoinPage() {
  const inviteUrl = optionalEnv("NEXT_PUBLIC_DISCORD_INVITE_URL");

  return (
    <div className="max-w-2xl space-y-8 sm:space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-medium text-warning">サーバーへの参加をご確認ください</p>
        <h1 className="page-heading">
          Discord サーバーへの参加
        </h1>
        <p className="text-muted">
          ログインしたアカウントで、学園の Discord サーバーへの参加を確認できませんでした。
          学園ポータルの利用には、サーバーへの参加が必要です。
        </p>
      </section>

      <section className="panel space-y-5" aria-labelledby="join-steps-heading">
        <h2 id="join-steps-heading" className="section-heading">参加の手順</h2>
        <ol className="list-decimal space-y-3 pl-6 text-muted marker:text-accent marker:font-semibold">
          <li>学園の Discord サーバーに参加する</li>
          <li>この学園ポータルに戻り、入口からあらためて Discord でログインする</li>
        </ol>

        {inviteUrl ? (
          <a
            href={inviteUrl}
            className="button button-primary w-full sm:w-auto"
          >
            Discord サーバーに参加する
          </a>
        ) : (
          <div className="rounded-lg border border-line bg-notice p-4">
            <p className="text-muted">招待リンクは、学園の公式サイトの案内をご確認ください。</p>
            <a href="https://rhythmgamesacademy.github.io/website/ja" className="text-link mt-2">公式サイトを確認する</a>
          </div>
        )}
      </section>

      <Link
        href="/"
        className="button"
      >
        入口に戻る
      </Link>
    </div>
  );
}
