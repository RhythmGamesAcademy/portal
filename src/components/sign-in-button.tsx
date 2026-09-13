import { signIn } from "@/auth";

export function SignInButton({ className = "" }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord", { redirectTo: "/id" });
      }}
    >
      <button
        type="submit"
        className={`inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-medium text-accent-ink transition-opacity hover:opacity-90 sm:w-auto ${className}`}
      >
        Discord でログイン
      </button>
    </form>
  );
}
