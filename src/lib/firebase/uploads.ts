"use client";

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { compressImage } from "@/lib/utils/image-compression";

export interface UploadedImage {
  url: string;
  storagePath: string;
}

/** Compresses then uploads a single image, returning its public URL and storage path. */
export async function uploadImage(
  file: File,
  path: string
): Promise<UploadedImage> {
  const compressed = await compressImage(file);
  const extension = compressed.type === "image/png" ? "png" : "webp";
  const storagePath = `${path}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`;
  const storageRef = ref(getFirebaseStorage(), storagePath);
  await uploadBytes(storageRef, compressed, {
    contentType: compressed.type,
  });
  const url = await getDownloadURL(storageRef);
  return { url, storagePath };
}

export async function deleteUploadedImage(storagePath: string): Promise<void> {
  if (!storagePath) return;
  try {
    await deleteObject(ref(getFirebaseStorage(), storagePath));
  } catch (error) {
    console.error("Failed to delete storage file", storagePath, error);
  }
}
