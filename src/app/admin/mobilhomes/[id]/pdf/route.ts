import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { getMobilHomeById } from "@/lib/data/mobilhomes";
import { getCompanySettings } from "@/lib/data/settings";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { MobilHomeSheet } from "@/lib/pdf/mobilhome-sheet";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import type { MobilHome } from "@/types/mobilhome";

export const runtime = "nodejs";

/**
 * This route is unauthenticated at the network level (Firebase Auth runs in
 * the browser only). For PUBLISHED mobil-homes the client SDK read is
 * allowed by Firestore rules for anyone, which is enough to generate a PDF.
 * For DRAFT mobil-homes, only the Firebase Admin SDK (service account) can
 * bypass the rules — configure FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL /
 * FIREBASE_PRIVATE_KEY to enable PDF generation for unpublished listings too.
 */
async function fetchMobilHomeForPdf(id: string): Promise<MobilHome | null> {
  if (isFirebaseAdminConfigured) {
    const snap = await getAdminDb().collection(COLLECTIONS.mobilhomes).doc(id).get();
    return snap.exists ? ({ id: snap.id, ...snap.data() } as MobilHome) : null;
  }
  return getMobilHomeById(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const localeParam = request.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const [mobilHome, settings] = await Promise.all([
    fetchMobilHomeForPdf(id),
    getCompanySettings(),
  ]);

  if (!mobilHome) {
    return NextResponse.json(
      {
        error:
          "Mobil-home introuvable, ou non publié (configurez Firebase Admin pour générer le PDF des brouillons).",
      },
      { status: 404 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const publicUrl = `${siteUrl}/${locale}/mobilhomes/${mobilHome.slug[locale]}`;
  const qrDataUrl = await QRCode.toDataURL(publicUrl, {
    margin: 1,
    color: { dark: "#252A2E", light: "#FFFFFF" },
  });

  const buffer = await renderToBuffer(
    MobilHomeSheet({ mobilHome, settings, locale, qrDataUrl, publicUrl })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${mobilHome.reference}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
