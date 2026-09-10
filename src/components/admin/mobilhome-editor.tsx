"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  EQUIPMENT_KEYS,
  LOCALES,
  MOBILHOME_CONDITIONS,
  MOBILHOME_STATUSES,
  MOBILHOME_TYPES,
  type MobilHome,
  type MobilHomeInput,
} from "@/types/mobilhome";
import { createMobilHome, updateMobilHome } from "@/lib/data/admin-mobilhomes";
import { uploadImage } from "@/lib/firebase/uploads";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { PhotoManager, type PendingPhoto } from "@/components/admin/photo-manager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservé",
  SOLD: "Vendu",
};
const TYPE_LABELS: Record<string, string> = { USED: "Occasion", NEW: "Neuf" };
const CONDITION_LABELS: Record<string, string> = {
  EXCELLENT: "Excellent",
  VERY_GOOD: "Très bon",
  GOOD: "Bon",
  TO_RENOVATE: "À rénover",
};
const EQUIPMENT_LABELS: Record<string, string> = {
  airConditioning: "Climatisation",
  heating: "Chauffage",
  oven: "Four",
  hobs: "Plaques de cuisson",
  fridge: "Réfrigérateur",
  dishwasher: "Lave-vaisselle",
  washingMachine: "Lave-linge",
  microwave: "Micro-ondes",
  television: "Télévision",
  terrace: "Terrasse",
  coveredTerrace: "Terrasse couverte",
  furnished: "Mobilier inclus",
  awning: "Auvent",
  shutters: "Volets",
  doubleGlazing: "Double vitrage",
};
const LOCALE_LABELS: Record<string, string> = { fr: "Français", es: "Español", pt: "Português" };

function emptyMobilHome(): MobilHomeInput {
  return {
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    type: "USED",
    condition: "GOOD",
    status: "AVAILABLE",
    price: 0,
    priceHT: null,
    vatRate: null,
    priceTTC: null,
    currency: "EUR",
    showPriceHT: false,
    showPriceTTC: true,
    surface: 0,
    length: null,
    width: null,
    height: null,
    bedrooms: 2,
    sleepingCapacity: 4,
    bathrooms: 1,
    toilets: 1,
    masterBedroom: false,
    dressingRoom: false,
    livingRoom: true,
    kitchen: true,
    equipment: [],
    country: "France",
    region: "",
    city: "",
    postalCode: "",
    publicLocation: "",
    deliveryFrance: false,
    deliverySpain: false,
    deliveryPortugal: false,
    deliveryEurope: false,
    installationAvailable: false,
    connectionAvailable: false,
    images: [],
    title: { fr: "", es: "", pt: "" },
    shortDescription: { fr: "", es: "", pt: "" },
    description: { fr: "", es: "", pt: "" },
    published: false,
    archived: false,
  };
}

export function MobilHomeEditor({ mobilHome }: { mobilHome?: MobilHome }) {
  const router = useRouter();
  const [form, setForm] = useState<MobilHomeInput>(() => mobilHome ?? emptyMobilHome());
  const [photos, setPhotos] = useState<PendingPhoto[]>(() =>
    (mobilHome?.images ?? [])
      .sort((a, b) => a.order - b.order)
      .map((img) => ({ id: img.storagePath || img.url, existing: img, previewUrl: img.url }))
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof MobilHomeInput>(key: K, value: MobilHomeInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleEquipment(key: (typeof EQUIPMENT_KEYS)[number]) {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(key)
        ? prev.equipment.filter((e) => e !== key)
        : [...prev.equipment, key],
    }));
  }

  async function handleSubmit(publish?: boolean) {
    if (!form.brand || !form.model || !form.city || !form.publicLocation) {
      toast.error("Merci de compléter les champs obligatoires (marque, modèle, ville, localisation publique).");
      return;
    }
    setSaving(true);
    try {
      const uploaded = await Promise.all(
        photos.map(async (p, index) => {
          if (p.existing) return { ...p.existing, order: index };
          if (p.file && isFirebaseConfigured) {
            const result = await uploadImage(p.file, "mobilhomes");
            return { url: result.url, storagePath: result.storagePath, alt: form.title.fr || form.brand, order: index };
          }
          // Demo mode without Firebase: keep local preview URL (not persisted).
          return { url: p.previewUrl, storagePath: "", alt: form.title.fr || form.brand, order: index };
        })
      );

      const payload: MobilHomeInput = { ...form, images: uploaded, published: publish ?? form.published };

      if (mobilHome) {
        await updateMobilHome(mobilHome.id, payload);
        toast.success("Mobil-home mis à jour");
      } else {
        const created = await createMobilHome(payload);
        toast.success(`Mobil-home créé (${created.reference})`);
        router.push(`/admin/mobilhomes/${created.id}`);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-anthracite">
            {mobilHome ? `Modifier ${mobilHome.reference}` : "Nouveau mobil-home"}
          </h1>
          {mobilHome && <p className="text-sm text-muted-foreground">{mobilHome.reference}</p>}
        </div>
        <div className="flex gap-2">
          {mobilHome && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <FileText className="h-4 w-4" /> Générer la fiche PDF
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(["fr", "es", "pt"] as const).map((locale) => (
                  <DropdownMenuItem
                    key={locale}
                    render={
                      <a
                        href={`/admin/mobilhomes/${mobilHome.id}/pdf?locale=${locale}`}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    PDF — {locale.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" disabled={saving} onClick={() => handleSubmit(false)}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer le brouillon
          </Button>
          <Button
            disabled={saving}
            onClick={() => handleSubmit(true)}
            className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
          >
            Publier
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="mb-1.5">Marque</Label>
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">Modèle</Label>
            <Input value={form.model} onChange={(e) => set("model", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">Année</Label>
            <Input type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5">Type</Label>
            <select className={selectClassName} value={form.type} onChange={(e) => set("type", e.target.value as MobilHomeInput["type"])}>
              {MOBILHOME_TYPES.map((v) => (
                <option key={v} value={v}>
                  {TYPE_LABELS[v]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="mb-1.5">État</Label>
            <select className={selectClassName} value={form.condition} onChange={(e) => set("condition", e.target.value as MobilHomeInput["condition"])}>
              {MOBILHOME_CONDITIONS.map((v) => (
                <option key={v} value={v}>
                  {CONDITION_LABELS[v]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="mb-1.5">Statut</Label>
            <select className={selectClassName} value={form.status} onChange={(e) => set("status", e.target.value as MobilHomeInput["status"])}>
              {MOBILHOME_STATUSES.map((v) => (
                <option key={v} value={v}>
                  {STATUS_LABELS[v]}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Prix</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="mb-1.5">Prix affiché (€)</Label>
            <Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5">Prix HT (€)</Label>
            <Input
              type="number"
              value={form.priceHT ?? ""}
              onChange={(e) => set("priceHT", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div>
            <Label className="mb-1.5">TVA (%)</Label>
            <Input
              type="number"
              value={form.vatRate ?? ""}
              onChange={(e) => set("vatRate", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div>
            <Label className="mb-1.5">Prix TTC (€)</Label>
            <Input
              type="number"
              value={form.priceTTC ?? ""}
              onChange={(e) => set("priceTTC", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.showPriceHT} onCheckedChange={(c) => set("showPriceHT", c === true)} />
            Afficher le prix HT
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.showPriceTTC} onCheckedChange={(c) => set("showPriceTTC", c === true)} />
            Afficher le prix TTC
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Caractéristiques</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <Label className="mb-1.5">Surface (m²)</Label>
            <Input type="number" value={form.surface} onChange={(e) => set("surface", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5">Longueur (m)</Label>
            <Input type="number" value={form.length ?? ""} onChange={(e) => set("length", e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div>
            <Label className="mb-1.5">Largeur (m)</Label>
            <Input type="number" value={form.width ?? ""} onChange={(e) => set("width", e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div>
            <Label className="mb-1.5">Hauteur (m)</Label>
            <Input type="number" value={form.height ?? ""} onChange={(e) => set("height", e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div>
            <Label className="mb-1.5">Chambres</Label>
            <Input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5">Couchages</Label>
            <Input type="number" value={form.sleepingCapacity} onChange={(e) => set("sleepingCapacity", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5">Salles de bain</Label>
            <Input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5">WC</Label>
            <Input type="number" value={form.toilets} onChange={(e) => set("toilets", Number(e.target.value))} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.masterBedroom} onCheckedChange={(c) => set("masterBedroom", c === true)} />
            Chambre parentale
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.dressingRoom} onCheckedChange={(c) => set("dressingRoom", c === true)} />
            Dressing
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.livingRoom} onCheckedChange={(c) => set("livingRoom", c === true)} />
            Salon
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.kitchen} onCheckedChange={(c) => set("kitchen", c === true)} />
            Cuisine
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Équipements</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {EQUIPMENT_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.equipment.includes(key)} onCheckedChange={() => toggleEquipment(key)} />
              {EQUIPMENT_LABELS[key]}
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Localisation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="mb-1.5">Pays</Label>
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">Région</Label>
            <Input value={form.region} onChange={(e) => set("region", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">Ville</Label>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5">Code postal</Label>
            <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5">Localisation publique (affichée sur le site)</Label>
            <Input
              value={form.publicLocation}
              placeholder="ex : Bordeaux, France"
              onChange={(e) => set("publicLocation", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Livraison</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.deliveryFrance} onCheckedChange={(c) => set("deliveryFrance", c === true)} />
            France
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.deliverySpain} onCheckedChange={(c) => set("deliverySpain", c === true)} />
            Espagne
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.deliveryPortugal} onCheckedChange={(c) => set("deliveryPortugal", c === true)} />
            Portugal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.deliveryEurope} onCheckedChange={(c) => set("deliveryEurope", c === true)} />
            Europe
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.installationAvailable} onCheckedChange={(c) => set("installationAvailable", c === true)} />
            Installation disponible
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.connectionAvailable} onCheckedChange={(c) => set("connectionAvailable", c === true)} />
            Raccordement disponible
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoManager photos={photos} onChange={setPhotos} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Contenu multilingue</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fr">
            <TabsList>
              {LOCALES.map((l) => (
                <TabsTrigger key={l} value={l}>
                  {LOCALE_LABELS[l]}
                </TabsTrigger>
              ))}
            </TabsList>
            {LOCALES.map((l) => (
              <TabsContent key={l} value={l} className="space-y-4 pt-4">
                <div>
                  <Label className="mb-1.5">Titre ({l.toUpperCase()})</Label>
                  <Input
                    value={form.title[l]}
                    onChange={(e) => set("title", { ...form.title, [l]: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Description courte ({l.toUpperCase()})</Label>
                  <Textarea
                    rows={2}
                    value={form.shortDescription[l]}
                    onChange={(e) =>
                      set("shortDescription", { ...form.shortDescription, [l]: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Description ({l.toUpperCase()})</Label>
                  <Textarea
                    rows={6}
                    value={form.description[l]}
                    onChange={(e) => set("description", { ...form.description, [l]: e.target.value })}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end gap-2 rounded-lg border border-border bg-white/95 p-3 shadow-lg backdrop-blur">
        <Button variant="outline" disabled={saving} onClick={() => handleSubmit(false)}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer le brouillon
        </Button>
        <Button
          disabled={saving}
          onClick={() => handleSubmit(true)}
          className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
        >
          Publier
        </Button>
      </div>
    </div>
  );
}
