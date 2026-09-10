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
import { COLLECTIONS } from "@/lib/firebase/collections";
import { readLocalCollection, writeLocalCollection } from "@/lib/data/local-store";
import type { Lead, LeadActivity, LeadNote, LeadStatus } from "@/types/lead";

const LEADS_KEY = "leads";
const NOTES_KEY = "leadNotes";
const ACTIVITIES_KEY = "leadActivities";

function loadLeadsLocal(): Lead[] {
  return readLocalCollection<Lead>(LEADS_KEY, []);
}
function saveLeadsLocal(items: Lead[]) {
  writeLocalCollection(LEADS_KEY, items);
}

export async function listLeadsAdmin(): Promise<Lead[]> {
  if (!isFirebaseConfigured) {
    return [...loadLeadsLocal()].sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, COLLECTIONS.leads));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Lead)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getLeadAdmin(id: string): Promise<Lead | null> {
  if (!isFirebaseConfigured) {
    return loadLeadsLocal().find((l) => l.id === id) ?? null;
  }
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, COLLECTIONS.leads, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Lead) : null;
}

async function addActivity(leadId: string, action: LeadActivity["action"], detail?: string) {
  const activity: Omit<LeadActivity, "id"> = {
    leadId,
    action,
    detail,
    author: "admin",
    createdAt: Date.now(),
  };
  if (!isFirebaseConfigured) {
    const items = readLocalCollection<LeadActivity>(ACTIVITIES_KEY, []);
    writeLocalCollection(ACTIVITIES_KEY, [
      { ...activity, id: `local-${Date.now()}` },
      ...items,
    ]);
    return;
  }
  const db = getFirebaseDb();
  await addDoc(collection(db, COLLECTIONS.leadActivities), activity);
}

export async function listLeadActivities(leadId: string): Promise<LeadActivity[]> {
  if (!isFirebaseConfigured) {
    return readLocalCollection<LeadActivity>(ACTIVITIES_KEY, [])
      .filter((a) => a.leadId === leadId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.leadActivities), where("leadId", "==", leadId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as LeadActivity)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!isFirebaseConfigured) {
    saveLeadsLocal(
      loadLeadsLocal().map((l) =>
        l.id === id ? { ...l, status, updatedAt: Date.now() } : l
      )
    );
  } else {
    const db = getFirebaseDb();
    await updateDoc(doc(db, COLLECTIONS.leads, id), { status, updatedAt: Date.now() });
  }
  await addActivity(id, "STATUS_CHANGED", status);
}

export async function markLeadRead(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    saveLeadsLocal(loadLeadsLocal().map((l) => (l.id === id ? { ...l, read: true } : l)));
    return;
  }
  const db = getFirebaseDb();
  await updateDoc(doc(db, COLLECTIONS.leads, id), { read: true });
}

export async function deleteLead(id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    saveLeadsLocal(loadLeadsLocal().filter((l) => l.id !== id));
    return;
  }
  const db = getFirebaseDb();
  await deleteDoc(doc(db, COLLECTIONS.leads, id));
}

export async function addLeadNote(leadId: string, text: string): Promise<void> {
  const note: Omit<LeadNote, "id"> = {
    leadId,
    text,
    author: "admin",
    createdAt: Date.now(),
  };
  if (!isFirebaseConfigured) {
    const items = readLocalCollection<LeadNote>(NOTES_KEY, []);
    writeLocalCollection(NOTES_KEY, [{ ...note, id: `local-${Date.now()}` }, ...items]);
  } else {
    const db = getFirebaseDb();
    await addDoc(collection(db, COLLECTIONS.leadNotes), note);
  }
  await addActivity(leadId, "NOTE_ADDED", text.slice(0, 80));
}

export async function listLeadNotes(leadId: string): Promise<LeadNote[]> {
  if (!isFirebaseConfigured) {
    return readLocalCollection<LeadNote>(NOTES_KEY, [])
      .filter((n) => n.leadId === leadId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  const db = getFirebaseDb();
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.leadNotes), where("leadId", "==", leadId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as LeadNote)
    .sort((a, b) => b.createdAt - a.createdAt);
}
