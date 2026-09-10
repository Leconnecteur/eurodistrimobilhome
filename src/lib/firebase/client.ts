/**
 * Firebase client SDK, isomorphic: used both in Server Components (for public,
 * read-only data honoring Security Rules) and in Client Components (admin auth,
 * CRUD, uploads). This avoids needing a Firebase Admin service account.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase n'est pas configuré. Renseignez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local."
    );
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

export function getFirebaseDb(): Firestore {
  if (!dbInstance) dbInstance = getFirestore(getFirebaseApp());
  return dbInstance;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) storageInstance = getStorage(getFirebaseApp());
  return storageInstance;
}

let appCheckInitialized = false;

/**
 * Initializes Firebase App Check (reCAPTCHA v3) to help protect public write
 * endpoints (leads, buy-back requests) from bots/abuse. No-op unless
 * NEXT_PUBLIC_RECAPTCHA_SITE_KEY is configured. Safe to call multiple times.
 */
export async function ensureAppCheck(): Promise<void> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!isFirebaseConfigured || !siteKey || appCheckInitialized || typeof window === "undefined") {
    return;
  }
  appCheckInitialized = true;
  const { initializeAppCheck, ReCaptchaV3Provider } = await import("firebase/app-check");
  initializeAppCheck(getFirebaseApp(), {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
