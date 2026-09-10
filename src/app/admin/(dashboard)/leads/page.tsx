"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { listLeadsAdmin } from "@/lib/data/admin-leads";
import type { Lead, LeadStatus } from "@/types/lead";
import { LEAD_STATUSES } from "@/types/lead";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-brand-gold/15 text-brand-gold",
  CONTACTED: "bg-brand-blue-light text-brand-anthracite",
  IN_DISCUSSION: "bg-brand-blue-light text-brand-anthracite",
  VISIT_SCHEDULED: "bg-status-reserved/10 text-status-reserved",
  NEGOTIATION: "bg-status-reserved/10 text-status-reserved",
  SOLD: "bg-status-available/10 text-status-available",
  LOST: "bg-status-sold/10 text-status-sold",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    listLeadsAdmin()
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (statusFilter ? leads.filter((l) => l.status === statusFilter) : leads),
    [leads, statusFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-brand-anthracite">Prospects</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tous les statuts</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Aucun prospect pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Type</th>
                <th className="p-3">Mobil-home</th>
                <th className="p-3">Source</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium text-brand-anthracite hover:underline">
                      {!lead.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-gold" />}
                      {lead.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </td>
                  <td className="p-3 text-muted-foreground">{lead.type}</td>
                  <td className="p-3 text-muted-foreground">{lead.mobileHomeReference ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">{lead.source}</td>
                  <td className="p-3">
                    <Badge className={STATUS_COLORS[lead.status]}>{lead.status}</Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
