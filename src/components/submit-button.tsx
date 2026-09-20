"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  primary = false,
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  primary?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className={`button ${primary ? "button-primary w-full sm:w-auto" : ""} ${className}`}
      >
        {pending ? pendingLabel : children}
      </button>
      <span role="status" aria-atomic="true" className="sr-only">
        {pending ? pendingLabel : ""}
      </span>
    </>
  );
}
