"use client";

import Link from "next/link";
import { useToasts } from "@/lib/toast";
import { Icon } from "./icon";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:right-6 sm:left-auto sm:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm animate-toast items-center gap-3 rounded-2xl border border-line-2 bg-panel-2/95 p-3 pr-4 shadow-2xl shadow-black/50 backdrop-blur"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-turbo/15 text-turbo">
            <Icon name="check" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{t.title}</p>
            {t.description && <p className="truncate text-xs text-steel">{t.description}</p>}
          </div>
          <Link href="/keranjang" className="shrink-0 text-xs font-bold text-ignite hover:underline">
            Lihat
          </Link>
        </div>
      ))}
    </div>
  );
}
