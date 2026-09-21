import { signIn } from "@/auth";
import { SubmitButton } from "@/components/submit-button";

export function SignInButton({
  redirectTo,
  label,
  pendingLabel,
  className = "",
}: {
  redirectTo: string;
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord", { redirectTo });
      }}
    >
      <SubmitButton primary pendingLabel={pendingLabel} className={className}>
        {label}
      </SubmitButton>
    </form>
  );
}
