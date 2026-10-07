"use client";

import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  const id = window.setInterval(listener, 1000);
  return () => window.clearInterval(id);
}

/** Waktu saat ini (dibulatkan per detik). Bernilai 0 saat render di server. */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => 0,
  );
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
