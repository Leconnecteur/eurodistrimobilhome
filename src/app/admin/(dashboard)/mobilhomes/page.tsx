"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteMobilHome,
  duplicateMobilHome,
  listMobilHomesAdmin,
} from "@/lib/data/admin-mobilhomes";
import type { MobilHome, MobilHomeStatus } from "@/types/mobilhome";
import { formatPrice } from "@/lib/utils/price";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { MobilHomeStatusSelect } from "@/components/admin/mobilhome-status-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MobilHomesTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get("status") as MobilHomeStatus | null;
  const [items, setItems] = useState<MobilHome[]>([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    listMobilHomesAdmin()
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refresh();
  }, []);

  const filtered = statusFilter ? items.filter((m) => m.status === statusFilter) : items;

  async function handleDuplicate(id: string) {
    const copy = await duplicateMobilHome(id);
    if (copy) {
      toast.success(`Mobil-home dupliqué (${copy.reference})`);
      router.push(`/admin/mobilhomes/${copy.id}`);
    }
  }

  async function handleDelete(id: string) {
    await deleteMobilHome(id);
    toast.success("Mobil-home supprimé");
    refresh();
  }

  async function handleShare(mobilHome: MobilHome) {
    const url = `${window.location.origin}/fr/mobilhomes/${mobilHome.slug.fr}`;
    await navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papiers");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-brand-anthracite">
          Mobil-homes {statusFilter ? `· ${statusFilter}` : ""}
        </h1>
        <ButtonLink href="/admin/mobilhomes/new" className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90">
          <Plus className="h-4 w-4" /> Ajouter un mobil-home
        </ButtonLink>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Aucun mobil-home pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">Référence</th>
                <th className="p-3">Mobil-home</th>
                <th className="p-3">Localisation</th>
                <th className="p-3">Prix</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Publié</th>
                <th className="p-3">Modifié</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {m.images[0] && (
                        <Image src={m.images[0].url} alt="" fill className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{m.reference}</td>
                  <td className="p-3">
                    <Link href={`/admin/mobilhomes/${m.id}`} className="font-medium text-brand-anthracite hover:underline">
                      {m.brand} {m.model}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{m.publicLocation}</td>
                  <td className="p-3 font-medium">{formatPrice(m.price, m.currency)}</td>
                  <td className="p-3">
                    <MobilHomeStatusSelect
                      id={m.id}
                      status={m.status}
                      onChanged={(status) =>
                        setItems((prev) => prev.map((p) => (p.id === m.id ? { ...p, status } : p)))
                      }
                    />
                  </td>
                  <td className="p-3">
                    {m.published ? (
                      <Badge className="bg-status-available/10 text-status-available">Publié</Badge>
                    ) : (
                      <Badge variant="outline">Brouillon</Badge>
                    )}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(m.updatedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" title="Voir la fiche publique" render={<a href={`/fr/mobilhomes/${m.slug.fr}`} target="_blank" rel="noreferrer" />}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Partager" onClick={() => handleShare(m)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" title="Générer la fiche PDF" />}>
                          <FileText className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(["fr", "es", "pt"] as const).map((locale) => (
                            <DropdownMenuItem
                              key={locale}
                              render={
                                <a
                                  href={`/admin/mobilhomes/${m.id}/pdf?locale=${locale}`}
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
                      <Button variant="ghost" size="icon-sm" title="Dupliquer" onClick={() => handleDuplicate(m.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" title="Supprimer" />}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce mobil-home ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible et supprimera également toutes ses
                              photos associées dans le stockage.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(m.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

export default function AdminMobilHomesPage() {
  return (
    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />}>
      <MobilHomesTable />
    </Suspense>
  );
}
