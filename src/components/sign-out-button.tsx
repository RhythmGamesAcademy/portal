import { signOut } from "@/auth";
import { SubmitButton } from "@/components/submit-button";

export function SignOutButton({ redirectTo, label, pendingLabel }: { redirectTo: string; label: string; pendingLabel: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo });
      }}
    >
      <SubmitButton pendingLabel={pendingLabel}>
        {label}
      </SubmitButton>
    </form>
  );
}
