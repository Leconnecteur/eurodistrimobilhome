"use client";

/**
 * Firestore's underlying long-polling transport can reject an in-flight
 * request with an AbortError when the user navigates away before it
 * completes (e.g. switching admin pages quickly). This is harmless — the
 * component that requested the data has already unmounted — but Next.js'
 * dev overlay surfaces every unhandled promise rejection as a runtime
 * error. Silence only this specific, known-benign case.
 */
export function installAbortErrorSuppressor() {
  if (typeof window === "undefined") return;
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const isAbort =
      (reason instanceof DOMException && reason.name === "AbortError") ||
      (reason && typeof reason === "object" && "name" in reason && reason.name === "AbortError");
    if (isAbort) {
      event.preventDefault();
    }
  });
}
