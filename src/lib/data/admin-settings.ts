"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { COLLECTIONS, SETTINGS_DOC_ID } from "@/lib/firebase/collections";
import { readLocalCollection, writeLocalCollection } from "@/lib/data/local-store";
import { DEFAULT_SETTINGS, type CompanySettings } from "@/types/settings";

const LOCAL_KEY = "settings";

export async function getCompanySettingsAdmin(): Promise<CompanySettings> {
  if (!isFirebaseConfigured) {
    const [settings] = readLocalCollection<CompanySettings>(LOCAL_KEY, [DEFAULT_SETTINGS]);
    return settings;
  }
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, COLLECTIONS.settings, SETTINGS_DOC_ID));
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...snap.data() } as CompanySettings;
}

export async function updateCompanySettings(settings: CompanySettings): Promise<void> {
  const updated = { ...settings, updatedAt: Date.now() };
  if (!isFirebaseConfigured) {
    writeLocalCollection(LOCAL_KEY, [updated]);
    return;
  }
  const db = getFirebaseDb();
  await setDoc(doc(db, COLLECTIONS.settings, SETTINGS_DOC_ID), updated, { merge: true });
}
