"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { deleteUploadedImage } from "@/lib/firebase/uploads";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { readLocalCollection, writeLocalCollection } from "@/lib/data/local-store";
import type {
  BuybackActivity,
  BuybackNote,
  BuybackRequest,
  BuybackStatus,
} from "@/types/buyback";

const REQUESTS_KEY = "buybackRequests";
const NOTES_KEY = "buybackNotes";
const ACTIVITIES_KEY = "buybackActivities";

function loadLocal(): BuybackRequest[] {
  return readLocalCollection<BuybackRequest>(REQUESTS_KEY, []);
}
function saveLocal(items: BuybackRequest[]) {
  writeLocalCollection(REQUESTS_KEY, items);
}

export async function listBuybackRequestsAdmin(): Promise<BuybackRequest[]> {
  if (!isFirebaseConfigured) {
    return [...loadLocal()].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, COLLECTIONS.buybackRequests));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as BuybackRequest)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getBuybackRequestAdmin(id: string): Promise<BuybackRequest | null> {
  if (!isFirebaseConfigured) {
    return loadLocal().find((r) => r.id === id) ?? null;
  }
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, COLLECTIONS.buybackRequests, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as BuybackRequest) : null;
}

async function addActivity(buybackId: string, action: string, detail?: string) {
  const activity: Omit<BuybackActivity, "id"> = {
    buybackId,
    action,
    detail,
    author: "admin",
    createdAt: Date.now(),
  };
  if (!isFirebaseConfigured) {
    const items = readLocalCollection<BuybackActivity>(ACTIVITIES_KEY, []);
    writeLocalCollection(ACTIVITIES_KEY, [
      { ...activity, id: `local-${Date.now()}` },
      ...items,
    ]);
    return;
  }
  const db = getFirebaseDb();
  await addDoc(collection(db, COLLECTIONS.buybackActivities), activity);
}

export async function listBuybackActivities(buybackId: string): Promise<BuybackActivity[]> {
  if (!isFirebaseConfigured) {
    return readLocalCollection<BuybackActivity>(ACTIVITIES_KEY, [])
      .filter((a) => a.buybackId === buybackId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.buybackActivities), where("buybackId", "==", buybackId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as BuybackActivity)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateBuybackStatus(id: string, status: BuybackStatus): Promise<void> {
  if (!isFirebaseConfigured) {
    saveLocal(
      loadLocal().map((r) => (r.id === id ? { ...r, status, updatedAt: Date.now() } : r))
    );
  } else {
    const db = getFirebaseDb();
    await updateDoc(doc(db, COLLECTIONS.buybackRequests, id), {
      status,
      updatedAt: Date.now(),
    });
  }
  await addActivity(id, "STATUS_CHANGED", status);
}

export async function markBuybackRead(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    saveLocal(loadLocal().map((r) => (r.id === id ? { ...r, read: true } : r)));
    return;
  }
  const db = getFirebaseDb();
  await updateDoc(doc(db, COLLECTIONS.buybackRequests, id), { read: true });
}

export async function archiveBuybackRequest(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    saveLocal(loadLocal().map((r) => (r.id === id ? { ...r, archived: true } : r)));
  } else {
    const db = getFirebaseDb();
    await updateDoc(doc(db, COLLECTIONS.buybackRequests, id), { archived: true });
  }
  await addActivity(id, "ARCHIVED");
}

export async function deleteBuybackRequest(id: string): Promise<void> {
  const request = await getBuybackRequestAdmin(id);
  if (request) {
    await Promise.all(
      request.images.map((img) =>
        img.storagePath ? deleteUploadedImage(img.storagePath) : Promise.resolve()
      )
    );
  }
  if (!isFirebaseConfigured) {
    saveLocal(loadLocal().filter((r) => r.id !== id));
    return;
  }
  const db = getFirebaseDb();
  await deleteDoc(doc(db, COLLECTIONS.buybackRequests, id));
}

export async function addBuybackNote(buybackId: string, text: string): Promise<void> {
  const note: Omit<BuybackNote, "id"> = {
    buybackId,
    text,
    author: "admin",
    createdAt: Date.now(),
  };
  if (!isFirebaseConfigured) {
    const items = readLocalCollection<BuybackNote>(NOTES_KEY, []);
    writeLocalCollection(NOTES_KEY, [{ ...note, id: `local-${Date.now()}` }, ...items]);
  } else {
    const db = getFirebaseDb();
    await addDoc(collection(db, COLLECTIONS.buybackNotes), note);
  }
  await addActivity(buybackId, "NOTE_ADDED", text.slice(0, 80));
}

export async function listBuybackNotes(buybackId: string): Promise<BuybackNote[]> {
  if (!isFirebaseConfigured) {
    return readLocalCollection<BuybackNote>(NOTES_KEY, [])
      .filter((n) => n.buybackId === buybackId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.buybackNotes), where("buybackId", "==", buybackId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as BuybackNote)
    .sort((a, b) => b.createdAt - a.createdAt);
}
