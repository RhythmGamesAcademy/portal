import type { Metadata } from "next";
import { optionalEnv } from "@/lib/env";

export const metadata: Metadata = { title: "Discord サーバーへの参加" };

export default function JoinPage() {
  const inviteUrl = optionalEnv("NEXT_PUBLIC_DISCORD_INVITE_URL");

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="font-serif text-2xl leading-snug tracking-wide sm:text-3xl">
          学園の Discord サーバーに
          <br className="sm:hidden" />
          参加していません
        </h1>
        <p className="text-base leading-loose text-muted">
          学務ポータルは、音楽ゲーム学園の Discord サーバーに参加している方のみ
          利用できます。学園は Discord 上で活動しているため、
          学籍番号の発行にはサーバーへの参加が必要です。
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-serif text-lg tracking-wide">参加の手順</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-loose text-muted">
          <li>学園の Discord サーバーに参加する</li>
          <li>この学務ポータルに戻り、あらためて Discord でログインする</li>
        </ol>

        {inviteUrl ? (
          <a
            href={inviteUrl}
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-medium text-accent-ink transition-opacity hover:opacity-90 sm:w-auto"
          >
            Discord サーバーに参加する
          </a>
        ) : (
          <p className="text-sm leading-loose text-muted">
            招待リンクは学園の案内をご確認ください。
          </p>
        )}
      </section>

      <a
        href="/"
        className="inline-block text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink"
      >
        入口に戻る
      </a>
    </div>
  );
}
