import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink"
      >
        ログアウト
      </button>
    </form>
  );
}
