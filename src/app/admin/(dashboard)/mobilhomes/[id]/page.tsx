"use client";

import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getMobilHomeAdmin } from "@/lib/data/admin-mobilhomes";
import { MobilHomeEditor } from "@/components/admin/mobilhome-editor";
import type { MobilHome } from "@/types/mobilhome";

export default function EditMobilHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [mobilHome, setMobilHome] = useState<MobilHome | null | undefined>(undefined);

  useEffect(() => {
    getMobilHomeAdmin(id).then(setMobilHome);
  }, [id]);

  if (mobilHome === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-anthracite" />
      </div>
    );
  }

  if (mobilHome === null) {
    return <p className="text-muted-foreground">Mobil-home introuvable.</p>;
  }

  return <MobilHomeEditor mobilHome={mobilHome} />;
}
