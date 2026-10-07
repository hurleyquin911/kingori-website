"use client";

import { useState } from "react";
import { Icon } from "./icon";

export function CopyButton({ value, label = "Salin" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
        copied ? "border-turbo/50 bg-turbo/10 text-turbo" : "border-line-2 text-chrome hover:border-ignite hover:text-ignite"
      }`}
    >
      <Icon name={copied ? "check" : "copy"} className="size-3.5" />
      {copied ? "Tersalin" : label}
    </button>
  );
}
