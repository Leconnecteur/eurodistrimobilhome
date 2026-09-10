"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { listBuybackRequestsAdmin } from "@/lib/data/admin-buyback";
import { BUYBACK_STATUSES, type BuybackRequest, type BuybackStatus } from "@/types/buyback";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<BuybackStatus, string> = {
  NEW: "bg-brand-gold/15 text-brand-gold",
  REVIEWING: "bg-brand-blue-light text-brand-anthracite",
  CONTACTED: "bg-brand-blue-light text-brand-anthracite",
  OFFER_SENT: "bg-status-reserved/10 text-status-reserved",
  ACCEPTED: "bg-status-available/10 text-status-available",
  REFUSED: "bg-status-sold/10 text-status-sold",
  CLOSED: "bg-muted text-muted-foreground",
};

export default function AdminBuybackPage() {
  const [requests, setRequests] = useState<BuybackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    listBuybackRequestsAdmin()
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (statusFilter ? requests.filter((r) => r.status === statusFilter) : requests),
    [requests, statusFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-brand-anthracite">
          Demandes de reprise
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tous les statuts</option>
          {BUYBACK_STATUSES.map((s) => (
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
          Aucune demande de reprise pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Vendeur</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Mobil-home</th>
                <th className="p-3">Localisation</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <Link href={`/admin/reprises/${r.id}`} className="font-medium text-brand-anthracite hover:underline">
                      {!r.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-gold" />}
                      {r.firstName} {r.lastName}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {r.email}
                    <br />
                    {r.phone}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {r.brand} {r.model} ({r.year})
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {r.city}, {r.country}
                  </td>
                  <td className="p-3">
                    <Badge className={STATUS_COLORS[r.status]}>{r.status}</Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
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
