import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/id");

  return (
    <div className="max-w-2xl space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <h1 className="page-heading">学園ポータル</h1>
        <p className="text-muted">音楽ゲーム学園の学籍番号を発行・確認する窓口です。</p>
      </div>

      <section className="panel space-y-6" aria-labelledby="login-heading">
        <div className="space-y-3">
          <h2 id="login-heading" className="section-heading">Discord でログイン</h2>
          <p className="text-muted">
            学園の Discord サーバーに参加しているアカウントでログインしてください。
          </p>
        </div>
        <div className="space-y-3 border-l-2 border-accent pl-4">
          <p>初回ログイン時に、学籍番号を発行します。</p>
          <p className="text-muted">次回からは、同じアカウントでログインすると同じ番号を確認できます。</p>
        </div>
        <SignInButton />
        <p className="text-sm text-muted">
          このポータルでは、Discord のパスワードやメールアドレスを扱いません。
        </p>
      </section>
    </div>
  );
}
