/* eslint-disable jsx-a11y/alt-text -- @react-pdf/renderer's <Image> renders into a PDF, not the DOM; it has no `alt` prop. */
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { MobilHome } from "@/types/mobilhome";
import type { CompanySettings } from "@/types/settings";
import type { Locale } from "@/types/mobilhome";
import { formatPrice, getDisplayPrice } from "@/lib/utils/price";

const COLORS = {
  anthracite: "#252A2E",
  gold: "#D9A72B",
  goldLight: "#F2C45A",
  cream: "#F4E9D5",
  muted: "#5C6166",
  border: "#E5E1D8",
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLORS.anthracite,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottom: `2px solid ${COLORS.gold}`,
  },
  companyName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.anthracite },
  companyTagline: { fontSize: 8, color: COLORS.gold, letterSpacing: 1 },
  reference: { fontSize: 9, color: COLORS.muted },
  heroImage: { width: "100%", height: 220, objectFit: "cover", borderRadius: 4 },
  thumbRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  thumb: { width: 84, height: 60, objectFit: "cover", borderRadius: 3 },
  titleBlock: { marginTop: 14, marginBottom: 8 },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  location: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  priceBlock: { marginTop: 10, marginBottom: 10 },
  price: { fontSize: 22, fontFamily: "Helvetica-Bold", color: COLORS.anthracite },
  priceLabel: { fontSize: 9, color: COLORS.muted },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 6,
    color: COLORS.anthracite,
  },
  charGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  charItem: {
    width: "31%",
    backgroundColor: COLORS.cream,
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  charLabel: { fontSize: 7, color: COLORS.muted },
  charValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  description: { fontSize: 9.5, lineHeight: 1.5, color: COLORS.anthracite },
  equipmentRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  equipmentTag: {
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor: COLORS.cream,
    borderRadius: 10,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerText: { fontSize: 8, color: COLORS.muted },
  qr: { width: 60, height: 60 },
});

const LABELS: Record<Locale, Record<string, string>> = {
  fr: {
    reference: "Référence",
    characteristics: "Caractéristiques",
    equipment: "Équipements",
    description: "Description",
    surface: "Surface",
    bedrooms: "Chambres",
    sleeping: "Couchages",
    bathrooms: "Salles de bain",
    year: "Année",
    brand: "Marque / Modèle",
    ttc: "TTC",
    ht: "HT",
    scanToView: "Scannez pour voir l'annonce",
  },
  es: {
    reference: "Referencia",
    characteristics: "Características",
    equipment: "Equipamiento",
    description: "Descripción",
    surface: "Superficie",
    bedrooms: "Habitaciones",
    sleeping: "Plazas",
    bathrooms: "Baños",
    year: "Año",
    brand: "Marca / Modelo",
    ttc: "IVA incluido",
    ht: "sin IVA",
    scanToView: "Escanee para ver el anuncio",
  },
  pt: {
    reference: "Referência",
    characteristics: "Características",
    equipment: "Equipamentos",
    description: "Descrição",
    surface: "Área",
    bedrooms: "Quartos",
    sleeping: "Capacidade",
    bathrooms: "Casas de banho",
    year: "Ano",
    brand: "Marca / Modelo",
    ttc: "com IVA",
    ht: "sem IVA",
    scanToView: "Digitalize para ver o anúncio",
  },
};

const EQUIPMENT_LABELS: Record<Locale, Record<string, string>> = {
  fr: {
    airConditioning: "Climatisation", heating: "Chauffage", oven: "Four", hobs: "Plaques",
    fridge: "Réfrigérateur", dishwasher: "Lave-vaisselle", washingMachine: "Lave-linge",
    microwave: "Micro-ondes", television: "Télévision", terrace: "Terrasse",
    coveredTerrace: "Terrasse couverte", furnished: "Meublé", awning: "Auvent",
    shutters: "Volets", doubleGlazing: "Double vitrage",
  },
  es: {
    airConditioning: "Aire acondicionado", heating: "Calefacción", oven: "Horno", hobs: "Placas",
    fridge: "Frigorífico", dishwasher: "Lavavajillas", washingMachine: "Lavadora",
    microwave: "Microondas", television: "Televisión", terrace: "Terraza",
    coveredTerrace: "Terraza cubierta", furnished: "Amueblado", awning: "Toldo",
    shutters: "Persianas", doubleGlazing: "Doble acristalamiento",
  },
  pt: {
    airConditioning: "Ar condicionado", heating: "Aquecimento", oven: "Forno", hobs: "Placas",
    fridge: "Frigorífico", dishwasher: "Máquina de lavar loiça", washingMachine: "Máquina de lavar roupa",
    microwave: "Micro-ondas", television: "Televisão", terrace: "Terraço",
    coveredTerrace: "Terraço coberto", furnished: "Mobilado", awning: "Toldo",
    shutters: "Persianas", doubleGlazing: "Vidro duplo",
  },
};

const STATUS_LABELS: Record<Locale, Record<string, string>> = {
  fr: { AVAILABLE: "Disponible", RESERVED: "Réservé", SOLD: "Vendu" },
  es: { AVAILABLE: "Disponible", RESERVED: "Reservado", SOLD: "Vendido" },
  pt: { AVAILABLE: "Disponível", RESERVED: "Reservado", SOLD: "Vendido" },
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "#1c8a4b",
  RESERVED: "#d9821a",
  SOLD: "#c0392b",
};

export function MobilHomeSheet({
  mobilHome,
  settings,
  locale,
  qrDataUrl,
  publicUrl,
}: {
  mobilHome: MobilHome;
  settings: CompanySettings;
  locale: Locale;
  qrDataUrl: string;
  publicUrl: string;
}) {
  const t = LABELS[locale];
  const eqLabels = EQUIPMENT_LABELS[locale];
  const { amount, vatLabel } = getDisplayPrice(mobilHome);
  const images = mobilHome.images.slice(0, 5);

  return (
    <Document
      title={`${mobilHome.reference} - ${mobilHome.title[locale]}`}
      author={settings.companyName}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{settings.companyName.toUpperCase()}</Text>
            <Text style={styles.companyTagline}>FRANCE · ESPAÑA · PORTUGAL</Text>
          </View>
          <Text style={styles.reference}>{t.reference}: {mobilHome.reference}</Text>
        </View>

        {images[0] && <Image src={images[0].url} style={styles.heroImage} />}
        {images.length > 1 && (
          <View style={styles.thumbRow}>
            {images.slice(1, 5).map((img, i) => (
              <Image key={i} src={img.url} style={styles.thumb} />
            ))}
          </View>
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{mobilHome.title[locale]}</Text>
          <Text style={styles.location}>{mobilHome.publicLocation}</Text>
          <Text
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${STATUS_COLORS[mobilHome.status]}20`,
                color: STATUS_COLORS[mobilHome.status],
              },
            ]}
          >
            {STATUS_LABELS[locale][mobilHome.status]}
          </Text>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatPrice(amount, mobilHome.currency)}</Text>
          {vatLabel && (
            <Text style={styles.priceLabel}>{vatLabel === "priceTTC" ? t.ttc : t.ht}</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>{t.characteristics}</Text>
        <View style={styles.charGrid}>
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>{t.brand}</Text>
            <Text style={styles.charValue}>{mobilHome.brand} {mobilHome.model}</Text>
          </View>
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>{t.year}</Text>
            <Text style={styles.charValue}>{mobilHome.year}</Text>
          </View>
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>{t.surface}</Text>
            <Text style={styles.charValue}>{mobilHome.surface} m²</Text>
          </View>
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>{t.bedrooms}</Text>
            <Text style={styles.charValue}>{mobilHome.bedrooms}</Text>
          </View>
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>{t.sleeping}</Text>
            <Text style={styles.charValue}>{mobilHome.sleepingCapacity}</Text>
          </View>
          <View style={styles.charItem}>
            <Text style={styles.charLabel}>{t.bathrooms}</Text>
            <Text style={styles.charValue}>{mobilHome.bathrooms}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.description}</Text>
        <Text style={styles.description}>{mobilHome.description[locale]}</Text>

        {mobilHome.equipment.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.equipment}</Text>
            <View style={styles.equipmentRow}>
              {mobilHome.equipment.map((key) => (
                <Text key={key} style={styles.equipmentTag}>
                  {eqLabels[key] ?? key}
                </Text>
              ))}
            </View>
          </>
        )}

        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerText}>{settings.companyName} — {settings.address}</Text>
            <Text style={styles.footerText}>{settings.phone} · {settings.email}</Text>
            <Text style={styles.footerText}>{t.scanToView} — {publicUrl}</Text>
          </View>
          <Image src={qrDataUrl} style={styles.qr} />
        </View>
      </Page>
    </Document>
  );
}
