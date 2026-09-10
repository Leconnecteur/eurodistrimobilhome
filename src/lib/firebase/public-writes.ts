"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ensureAppCheck, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { readLocalCollection, writeLocalCollection } from "@/lib/data/local-store";
import type { Lead, LeadInput } from "@/types/lead";
import type { BuybackRequest, BuybackRequestInput } from "@/types/buyback";

/**
 * Public writes go directly from the browser to Firestore. They are
 * constrained by Firestore Security Rules (strict field validation, no
 * update/delete access) so this stays safe without a backend endpoint.
 */

const RATE_LIMIT_MS = 20_000;

/** Basic client-side throttle to slow down automated repeat submissions. */
function assertNotRateLimited(key: string) {
  if (typeof window === "undefined") return;
  const storageKey = `edm-last-submit:${key}`;
  const last = Number(window.localStorage.getItem(storageKey) ?? 0);
  if (Date.now() - last < RATE_LIMIT_MS) {
    throw new Error("Merci de patienter quelques secondes avant de renvoyer une demande.");
  }
  window.localStorage.setItem(storageKey, String(Date.now()));
}

export async function submitLead(input: LeadInput): Promise<void> {
  assertNotRateLimited("lead");
  await ensureAppCheck();
  if (!isFirebaseConfigured) {
    const lead: Lead = {
      ...input,
      id: `local-${Date.now()}`,
      status: "NEW",
      read: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const items = readLocalCollection<Lead>("leads", []);
    writeLocalCollection("leads", [lead, ...items]);
    return;
  }
  const db = getFirebaseDb();
  await addDoc(collection(db, COLLECTIONS.leads), {
    ...input,
    status: "NEW",
    read: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    _serverCreatedAt: serverTimestamp(),
  });
}

export async function submitBuybackRequest(
  input: BuybackRequestInput
): Promise<void> {
  assertNotRateLimited("buyback");
  await ensureAppCheck();
  if (!isFirebaseConfigured) {
    const request: BuybackRequest = {
      ...input,
      id: `local-${Date.now()}`,
      status: "NEW",
      archived: false,
      read: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const items = readLocalCollection<BuybackRequest>("buybackRequests", []);
    writeLocalCollection("buybackRequests", [request, ...items]);
    return;
  }
  const db = getFirebaseDb();
  await addDoc(collection(db, COLLECTIONS.buybackRequests), {
    ...input,
    status: "NEW",
    archived: false,
    read: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    _serverCreatedAt: serverTimestamp(),
  });
}
