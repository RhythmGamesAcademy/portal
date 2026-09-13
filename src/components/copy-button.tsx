"use client";

import { useEffect, useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center rounded-md border border-line px-4 py-2 text-sm text-ink transition-colors hover:bg-notice"
      aria-live="polite"
    >
      {copied ? "コピーしました" : "学籍番号をコピー"}
    </button>
  );
}
