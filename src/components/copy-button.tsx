"use client";

import { useId, useRef, useState } from "react";

export function CopyButton({
  value,
  label,
  pendingLabel,
  successMessage,
  errorMessage,
  workingMessage,
}: {
  value: string;
  label: string;
  pendingLabel: string;
  successMessage: string;
  errorMessage: string;
  workingMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const busy = useRef(false);
  const messageId = useId();

  async function copy() {
    if (busy.current) return;
    busy.current = true;
    setStatus("pending");
    try {
      await navigator.clipboard.writeText(value);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={copy}
        disabled={status === "pending"}
        aria-busy={status === "pending"}
        aria-describedby={messageId}
        className="button"
      >
        {status === "pending" ? pendingLabel : label}
      </button>
      <p
        id={messageId}
        role="status"
        aria-atomic="true"
        className={`min-h-6 text-sm ${status === "error" ? "text-danger" : status === "success" ? "text-success" : "text-muted"}`}
      >
        {status === "success" && successMessage}
        {status === "error" && errorMessage}
        {status === "pending" && workingMessage}
      </p>
    </div>
  );
}
