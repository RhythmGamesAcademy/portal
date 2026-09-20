import { signOut } from "@/auth";
import { SubmitButton } from "@/components/submit-button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <SubmitButton pendingLabel="ログアウト中…">
        ログアウト
      </SubmitButton>
    </form>
  );
}
