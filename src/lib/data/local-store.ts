"use client";

/**
 * Lightweight localStorage-backed persistence used ONLY as a fallback when
 * Firebase is not configured yet, so the admin panel remains usable for
 * demoing/testing before Firebase credentials are set up. Once Firebase is
 * configured, all reads/writes go through Firestore instead.
 */
const PREFIX = "edm-demo:";

export function readLocalCollection<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

export function writeLocalCollection<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(items));
}
