"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getCompanySettingsAdmin, updateCompanySettings } from "@/lib/data/admin-settings";
import type { CompanySettings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCompanySettingsAdmin()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateCompanySettings(settings);
      toast.success("Paramètres enregistrés");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-brand-anthracite">Paramètres</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Informations de l&apos;entreprise</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5">Nom de l&apos;entreprise</Label>
            <Input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
          </div>
          <div>
            <Label className="mb-1.5">SIRET</Label>
            <Input
              value={settings.siret ?? ""}
              placeholder="À renseigner"
              onChange={(e) => setSettings({ ...settings, siret: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-1.5">Téléphone</Label>
            <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </div>
          <div>
            <Label className="mb-1.5">WhatsApp (avec indicatif, ex: +33...)</Label>
            <Input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
          </div>
          <div>
            <Label className="mb-1.5">Email</Label>
            <Input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5">Adresse</Label>
            <Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Réseaux sociaux</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5">Facebook</Label>
            <Input
              placeholder="https://facebook.com/..."
              value={settings.socialLinks.facebook ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })
              }
            />
          </div>
          <div>
            <Label className="mb-1.5">Instagram</Label>
            <Input
              placeholder="https://instagram.com/..."
              value={settings.socialLinks.instagram ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })
              }
            />
          </div>
          <div>
            <Label className="mb-1.5">LinkedIn</Label>
            <Input
              placeholder="https://linkedin.com/company/..."
              value={settings.socialLinks.linkedin ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Affichage du catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={settings.showSoldMobilHomes}
              onCheckedChange={(c) => setSettings({ ...settings, showSoldMobilHomes: c === true })}
            />
            Afficher les mobil-homes vendus dans le catalogue public
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
