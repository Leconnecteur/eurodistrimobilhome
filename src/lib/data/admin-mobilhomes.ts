"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { deleteUploadedImage } from "@/lib/firebase/uploads";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { readLocalCollection, writeLocalCollection } from "@/lib/data/local-store";
import { MOCK_MOBILHOMES } from "@/lib/data/mock-mobilhomes";
import { buildMobilHomeSlug } from "@/lib/utils/slug";
import type { MobilHome, MobilHomeInput } from "@/types/mobilhome";

const LOCAL_KEY = "mobilhomes";

function loadLocal(): MobilHome[] {
  return readLocalCollection(LOCAL_KEY, MOCK_MOBILHOMES);
}
function saveLocal(items: MobilHome[]) {
  writeLocalCollection(LOCAL_KEY, items);
}

export async function generateReference(): Promise<string> {
  const year = new Date().getFullYear();
  if (!isFirebaseConfigured) {
    const items = loadLocal();
    const countThisYear = items.filter((m) => m.reference.includes(String(year))).length;
    return `EDM-${year}-${String(countThisYear + 1).padStart(3, "0")}`;
  }
  const db = getFirebaseDb();
  const counterRef = doc(db, COLLECTIONS.counters, `mobilhomes-${year}`);
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().value as number) : 0;
    const value = current + 1;
    tx.set(counterRef, { value }, { merge: true });
    return value;
  });
  return `EDM-${year}-${String(next).padStart(3, "0")}`;
}

export async function listMobilHomesAdmin(): Promise<MobilHome[]> {
  if (!isFirebaseConfigured) {
    return [...loadLocal()].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, COLLECTIONS.mobilhomes));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as MobilHome)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getMobilHomeAdmin(id: string): Promise<MobilHome | null> {
  if (!isFirebaseConfigured) {
    return loadLocal().find((m) => m.id === id) ?? null;
  }
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, COLLECTIONS.mobilhomes, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as MobilHome) : null;
}

export async function createMobilHome(input: MobilHomeInput): Promise<MobilHome> {
  const reference = await generateReference();
  const slug = {
    fr: buildMobilHomeSlug(input.brand, input.model, reference),
    es: buildMobilHomeSlug(input.brand, input.model, reference),
    pt: buildMobilHomeSlug(input.brand, input.model, reference),
  };
  const now = Date.now();
  const mobilHome: MobilHome = {
    ...input,
    id: "",
    reference,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  if (!isFirebaseConfigured) {
    const id = `local-${now}`;
    const withId = { ...mobilHome, id };
    saveLocal([withId, ...loadLocal()]);
    return withId;
  }

  const db = getFirebaseDb();
  const ref = doc(collection(db, COLLECTIONS.mobilhomes));
  const { id: _omit, ...data } = mobilHome;
  void _omit;
  await setDoc(ref, data);
  return { ...mobilHome, id: ref.id };
}

export async function updateMobilHome(
  id: string,
  patch: Partial<MobilHomeInput>
): Promise<void> {
  const updatedAt = Date.now();
  if (!isFirebaseConfigured) {
    saveLocal(
      loadLocal().map((m) => (m.id === id ? { ...m, ...patch, updatedAt } : m))
    );
    return;
  }
  const db = getFirebaseDb();
  await updateDoc(doc(db, COLLECTIONS.mobilhomes, id), { ...patch, updatedAt });
}

export async function deleteMobilHome(id: string): Promise<void> {
  const mobilHome = await getMobilHomeAdmin(id);
  if (mobilHome) {
    await Promise.all(
      mobilHome.images.map((img) =>
        img.storagePath ? deleteUploadedImage(img.storagePath) : Promise.resolve()
      )
    );
  }
  if (!isFirebaseConfigured) {
    saveLocal(loadLocal().filter((m) => m.id !== id));
    return;
  }
  const db = getFirebaseDb();
  await deleteDoc(doc(db, COLLECTIONS.mobilhomes, id));
}

/** Duplicates a mobil-home's characteristics/content, but never its photos, to avoid Storage bloat. */
export async function duplicateMobilHome(id: string): Promise<MobilHome | null> {
  const source = await getMobilHomeAdmin(id);
  if (!source) return null;
  const {
    id: _id,
    reference: _reference,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    slug: _slug,
    ...rest
  } = source;
  void _id;
  void _reference;
  void _createdAt;
  void _updatedAt;
  void _slug;
  return createMobilHome({
    ...rest,
    images: [],
    published: false,
  });
}
