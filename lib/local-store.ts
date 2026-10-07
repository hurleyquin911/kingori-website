"use client";

import { useSyncExternalStore } from "react";

export function createLocalStore<T>(key: string, fallback: T) {
  let cache = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  function get() {
    if (!loaded) {
      loaded = true;
      try {
        const raw = window.localStorage.getItem(key);
        cache = raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        cache = fallback;
      }
    }
    return cache;
  }

  function set(next: T | ((prev: T) => T)) {
    cache = typeof next === "function" ? (next as (prev: T) => T)(get()) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(cache));
    } catch {}
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        loaded = false;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => fallback);
  }

  return { get, set, useValue };
}

const noopSubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
