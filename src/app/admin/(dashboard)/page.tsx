"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Loader2, ShieldCheck, Tag, Truck, Users, Warehouse } from "lucide-react";
import { listMobilHomesAdmin } from "@/lib/data/admin-mobilhomes";
import { listLeadsAdmin } from "@/lib/data/admin-leads";
import { listBuybackRequestsAdmin } from "@/lib/data/admin-buyback";
import type { MobilHome } from "@/types/mobilhome";
import type { Lead } from "@/types/lead";
import { BUYBACK_STATUS_LABELS } from "@/types/buyback";
import type { BuybackRequest } from "@/types/buyback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Home;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent ?? "bg-brand-cream text-brand-anthracite"}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold text-brand-anthracite">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [mobilHomes, setMobilHomes] = useState<MobilHome[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [buybacks, setBuybacks] = useState<BuybackRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listMobilHomesAdmin(), listLeadsAdmin(), listBuybackRequestsAdmin()])
      .then(([m, l, b]) => {
        setMobilHomes(m);
        setLeads(l);
        setBuybacks(b);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
      </div>
    );
  }

  const available = mobilHomes.filter((m) => m.status === "AVAILABLE").length;
  const reserved = mobilHomes.filter((m) => m.status === "RESERVED").length;
  const sold = mobilHomes.filter((m) => m.status === "SOLD").length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const newBuybacks = buybacks.filter((b) => b.status === "NEW").length;
  const unread = leads.filter((l) => !l.read).length + buybacks.filter((b) => !b.read).length;

  const recentLeads = leads.slice(0, 5);
  const recentBuybacks = buybacks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-anthracite">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble de votre activité.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Tag} label="Disponibles" value={available} accent="bg-status-available/10 text-status-available" />
        <StatCard icon={Warehouse} label="Réservés" value={reserved} accent="bg-status-reserved/10 text-status-reserved" />
        <StatCard icon={ShieldCheck} label="Vendus" value={sold} accent="bg-status-sold/10 text-status-sold" />
        <StatCard icon={Users} label="Nouveaux prospects" value={newLeads} />
        <StatCard icon={Truck} label="Demandes de reprise" value={newBuybacks} />
        <StatCard icon={Home} label="Non traitées" value={unread} accent="bg-brand-gold/15 text-brand-gold" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Derniers prospects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
            )}
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-brand-anthracite">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.type} {lead.mobileHomeReference ? `· ${lead.mobileHomeReference}` : ""}
                  </p>
                </div>
                <Badge variant="outline">{lead.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Dernières demandes de reprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBuybacks.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
            )}
            {recentBuybacks.map((request) => (
              <Link
                key={request.id}
                href={`/admin/reprises/${request.id}`}
                className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-brand-anthracite">
                    {request.firstName} {request.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.brand} {request.model} · {request.city}
                  </p>
                </div>
                <Badge variant="outline">{BUYBACK_STATUS_LABELS[request.status]}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
