"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  pending: pendingProp,
  primary = false,
  disabled = false,
  form,
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  pending?: boolean;
  primary?: boolean;
  disabled?: boolean;
  form?: string;
  className?: string;
}) {
  const { pending: formPending } = useFormStatus();
  const pending = pendingProp ?? formPending;

  return (
    <>
      <button
        type="submit"
        form={form}
        disabled={pending || disabled}
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
