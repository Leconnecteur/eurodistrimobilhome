"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import {
  addLeadNote,
  getLeadAdmin,
  listLeadActivities,
  listLeadNotes,
  markLeadRead,
  updateLeadStatus,
} from "@/lib/data/admin-leads";
import { LEAD_STATUSES, type Lead, type LeadActivity, type LeadNote } from "@/types/lead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ACTIVITY_LABELS: Record<string, string> = {
  LEAD_RECEIVED: "Demande reçue",
  CONTACTED: "Contact effectué",
  NOTE_ADDED: "Note ajoutée",
  STATUS_CHANGED: "Statut modifié",
  ARCHIVED: "Archivé",
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function refresh() {
    const [l, n, a] = await Promise.all([
      getLeadAdmin(id),
      listLeadNotes(id),
      listLeadActivities(id),
    ]);
    setLead(l);
    setNotes(n);
    setActivities(a);
    if (l && !l.read) await markLeadRead(id);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: string) {
    await updateLeadStatus(id, status as Lead["status"]);
    toast.success("Statut mis à jour");
    refresh();
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await addLeadNote(id, noteText.trim());
      setNoteText("");
      refresh();
    } finally {
      setSavingNote(false);
    }
  }

  if (lead === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
      </div>
    );
  }

  if (lead === null) {
    return <p className="text-muted-foreground">Prospect introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/leads" className="text-sm text-muted-foreground hover:text-brand-anthracite">
          ← Retour aux prospects
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-brand-anthracite">{lead.name}</h1>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-heading text-base">Coordonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-gold" />
              <a href={`mailto:${lead.email}`} className="hover:underline">
                {lead.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-gold" />
              <a href={`tel:${lead.phone}`} className="hover:underline">
                {lead.phone}
              </a>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline">{lead.type}</Badge>
              <Badge variant="outline">{lead.source}</Badge>
              {lead.mobileHomeReference && (
                <Badge variant="outline">{lead.mobileHomeReference}</Badge>
              )}
            </div>
            <p className="pt-2 text-xs text-muted-foreground">
              Reçu le {new Date(lead.createdAt).toLocaleString("fr-FR")}
            </p>
            {lead.message && (
              <div className="rounded-md bg-muted/50 p-3 text-sm text-brand-anthracite">
                {lead.message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
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
                      {ACTIVITY_LABELS[a.action] ?? a.action}
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
    </div>
  );
}
