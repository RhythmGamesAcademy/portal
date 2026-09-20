import { signIn } from "@/auth";
import { SubmitButton } from "@/components/submit-button";

export function SignInButton({ className = "" }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord", { redirectTo: "/id" });
      }}
    >
      <SubmitButton primary pendingLabel="ログイン画面へ移動中…" className={className}>
        Discord でログイン
      </SubmitButton>
    </form>
  );
}
