import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { COLLECTIONS, SETTINGS_DOC_ID } from "@/lib/firebase/collections";
import { DEFAULT_SETTINGS, type CompanySettings } from "@/types/settings";

export async function getCompanySettings(): Promise<CompanySettings> {
  if (!isFirebaseConfigured) return DEFAULT_SETTINGS;
  try {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, COLLECTIONS.settings, SETTINGS_DOC_ID));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...snap.data() } as CompanySettings;
  } catch (error) {
    console.error("Failed to fetch settings", error);
    return DEFAULT_SETTINGS;
  }
}
