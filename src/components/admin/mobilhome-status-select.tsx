"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { MobilHomeStatus } from "@/types/mobilhome";
import { MOBILHOME_STATUSES } from "@/types/mobilhome";
import { updateMobilHome } from "@/lib/data/admin-mobilhomes";

const LABELS: Record<MobilHomeStatus, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservé",
  SOLD: "Vendu",
};

export function MobilHomeStatusSelect({
  id,
  status,
  onChanged,
}: {
  id: string;
  status: MobilHomeStatus;
  onChanged?: (status: MobilHomeStatus) => void;
}) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: MobilHomeStatus) {
    setValue(next);
    setSaving(true);
    try {
      await updateMobilHome(id, { status: next });
      onChanged?.(next);
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de mettre à jour le statut");
      setValue(status);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as MobilHomeStatus)}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {MOBILHOME_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
