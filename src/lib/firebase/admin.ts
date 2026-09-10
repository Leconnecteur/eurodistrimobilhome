import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

export const isFirebaseAdminConfigured = Boolean(
  projectId && clientEmail && privateKey
);

let app: App | undefined;

function getAdminApp(): App {
  if (!isFirebaseAdminConfigured) {
    throw new Error(
      "Firebase Admin n'est pas configuré. Renseignez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY dans les variables d'environnement du serveur."
    );
  }
  if (!getApps().length) {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    });
  } else {
    app = getApps()[0];
  }
  return app!;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminStorage(): Storage {
  return getStorage(getAdminApp());
}
