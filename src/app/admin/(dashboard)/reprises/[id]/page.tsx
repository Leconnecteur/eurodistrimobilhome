"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Archive, Loader2, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import {
  addBuybackNote,
  archiveBuybackRequest,
  getBuybackRequestAdmin,
  listBuybackActivities,
  listBuybackNotes,
  markBuybackRead,
  updateBuybackStatus,
} from "@/lib/data/admin-buyback";
import {
  BUYBACK_STATUSES,
  BUYBACK_STATUS_LABELS,
  type BuybackActivity,
  type BuybackNote,
  type BuybackRequest,
} from "@/types/buyback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BuybackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [request, setRequest] = useState<BuybackRequest | null | undefined>(undefined);
  const [notes, setNotes] = useState<BuybackNote[]>([]);
  const [activities, setActivities] = useState<BuybackActivity[]>([]);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function refresh() {
    const [r, n, a] = await Promise.all([
      getBuybackRequestAdmin(id),
      listBuybackNotes(id),
      listBuybackActivities(id),
    ]);
    setRequest(r);
    setNotes(n);
    setActivities(a);
    if (r && !r.read) await markBuybackRead(id);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: string) {
    await updateBuybackStatus(id, status as BuybackRequest["status"]);
    toast.success("Statut mis à jour");
    refresh();
  }

  async function handleArchive() {
    await archiveBuybackRequest(id);
    toast.success("Demande archivée");
    refresh();
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await addBuybackNote(id, noteText.trim());
      setNoteText("");
      refresh();
    } finally {
      setSavingNote(false);
    }
  }

  if (request === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
      </div>
    );
  }

  if (request === null) {
    return <p className="text-muted-foreground">Demande introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reprises" className="text-sm text-muted-foreground hover:text-brand-anthracite">
          ← Retour aux demandes de reprise
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-brand-anthracite">
            {request.firstName} {request.lastName} — {request.brand} {request.model}
          </h1>
          <div className="flex gap-2">
            <select
              value={request.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
            >
              {BUYBACK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {BUYBACK_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleArchive} disabled={request.archived}>
              <Archive className="h-4 w-4" /> {request.archived ? "Archivée" : "Archiver"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Informations du mobil-home</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div><p className="text-xs text-muted-foreground">Marque / Modèle</p><p className="font-medium">{request.brand} {request.model}</p></div>
              <div><p className="text-xs text-muted-foreground">Année</p><p className="font-medium">{request.year}</p></div>
              <div><p className="text-xs text-muted-foreground">Surface</p><p className="font-medium">{request.surface} m²</p></div>
              <div><p className="text-xs text-muted-foreground">Chambres</p><p className="font-medium">{request.bedrooms}</p></div>
              <div><p className="text-xs text-muted-foreground">Salles de bain</p><p className="font-medium">{request.bathrooms}</p></div>
              <div><p className="text-xs text-muted-foreground">Localisation</p><p className="font-medium">{request.city}, {request.country}</p></div>
              <div><p className="text-xs text-muted-foreground">État</p><p className="font-medium">{request.condition}</p></div>
              {request.desiredPrice != null && (
                <div><p className="text-xs text-muted-foreground">Prix souhaité</p><p className="font-medium">{request.desiredPrice} €</p></div>
              )}
              <div className="col-span-full flex flex-wrap gap-2">
                {request.terrace && <Badge variant="outline">Terrasse</Badge>}
                {request.airConditioning && <Badge variant="outline">Climatisation</Badge>}
                {request.heating && <Badge variant="outline">Chauffage</Badge>}
                {request.furnished && <Badge variant="outline">Mobilier inclus</Badge>}
              </div>
              <div className="col-span-full">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-1 whitespace-pre-line">{request.description}</p>
              </div>
              {request.otherEquipment && (
                <div className="col-span-full">
                  <p className="text-xs text-muted-foreground">Autres équipements</p>
                  <p className="mt-1">{request.otherEquipment}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {request.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">Photos</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {request.images.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Notes internes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ajouter une note..."
                  rows={2}
                />
                <Button onClick={handleAddNote} disabled={savingNote} className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {notes.length === 0 && <p className="text-sm text-muted-foreground">Aucune note.</p>}
                {notes.map((note) => (
                  <div key={note.id} className="rounded-md border border-border p-3 text-sm">
                    <p>{note.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <h3 className="mb-2 text-sm font-semibold text-brand-anthracite">Historique</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {activities.map((a) => (
                    <li key={a.id} className="flex justify-between">
                      <span>
                        {a.action}
                        {a.detail ? ` — ${a.detail}` : ""}
                      </span>
                      <span>{new Date(a.createdAt).toLocaleString("fr-FR")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Coordonnées du vendeur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium">{request.firstName} {request.lastName}</p>
            {request.company && <p className="text-muted-foreground">{request.company}</p>}
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-gold" />
              <a href={`mailto:${request.email}`} className="hover:underline">{request.email}</a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-gold" />
              <a href={`tel:${request.phone}`} className="hover:underline">{request.phone}</a>
            </p>
            <p className="text-xs text-muted-foreground">
              {request.sellerCity}, {request.sellerCountry}
            </p>
            <p className="pt-2 text-xs text-muted-foreground">
              Reçue le {new Date(request.createdAt).toLocaleString("fr-FR")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
