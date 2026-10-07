"use client";

import { useSyncExternalStore } from "react";

export type Toast = { id: number; title: string; description?: string };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const EMPTY: Toast[] = [];

function emit() {
  listeners.forEach((l) => l());
}

export function toast(title: string, description?: string) {
  const id = nextId++;
  toasts = [...toasts, { id, title, description }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3200);
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => EMPTY,
  );
}
