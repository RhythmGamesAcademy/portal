import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/id");

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="font-serif text-3xl leading-snug tracking-wide sm:text-4xl">
          音楽ゲーム学園
          <br />
          学務ポータル
        </h1>
        <p className="text-base leading-loose text-muted">
          音楽ゲーム学園に在籍する学生のための窓口です。
          はじめに学籍番号の発行を受けてください。学籍番号は講義の受講や
          レポートの提出を通じて、在籍中つねに用いる番号です。
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-serif text-lg tracking-wide">ログイン</h2>
        <p className="text-sm leading-loose text-muted">
          学園の Discord サーバーに参加しているアカウントでログインしてください。
          パスワードやメールアドレスは扱いません。
        </p>
        <SignInButton />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg tracking-wide">この先の機能について</h2>
        <p className="text-sm leading-loose text-muted">
          履修登録および成績の閲覧は、後日この学務ポータル上で提供します。
          現在は学籍番号の発行と確認のみを行っています。
        </p>
      </section>
    </div>
  );
}
