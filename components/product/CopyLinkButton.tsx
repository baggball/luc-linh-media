"use client";

import { useState } from "react";

export default function CopyLinkButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className={copied ? "copied" : ""} title="Copy link" onClick={handleCopy}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
      </svg>
    </button>
  );
}
