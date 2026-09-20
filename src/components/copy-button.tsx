"use client";

import { useId, useRef, useState } from "react";

export function CopyButton({ value }: { value: string }) {
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
        {status === "pending" ? "コピー中…" : "学籍番号をコピー"}
      </button>
      <p
        id={messageId}
        role="status"
        aria-atomic="true"
        className={`min-h-6 text-sm ${status === "error" ? "text-danger" : status === "success" ? "text-success" : "text-muted"}`}
      >
        {status === "success" && "学籍番号をコピーしました。"}
        {status === "error" && "コピーできませんでした。もう一度お試しいただくか、上の番号を選択して手動でコピーしてください。"}
        {status === "pending" && "学籍番号をコピーしています。"}
      </p>
    </div>
  );
}
