"use client";

import { MessageCircle, Phone } from "lucide-react";
import { buildTelLink, buildWhatsAppLink } from "@/lib/utils/whatsapp";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function StickyMobileCta({
  phone,
  whatsapp,
  whatsappMessage,
  dict,
}: {
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  dict: Dictionary;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
      <a
        href={buildTelLink(phone)}
        className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-brand-anthracite"
      >
        <Phone className="h-4 w-4" /> {dict.mobilhome.call}
      </a>
      <div className="w-px bg-border" />
      <a
        href={buildWhatsAppLink(whatsapp, whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 bg-status-available py-3 text-sm font-medium text-white"
      >
        <MessageCircle className="h-4 w-4" /> {dict.mobilhome.whatsapp}
      </a>
      <div className="w-px bg-border" />
      <a
        href="#contact-form"
        className="flex flex-1 items-center justify-center gap-2 bg-brand-gold py-3 text-sm font-medium text-brand-anthracite"
      >
        {dict.mobilhome.contactTitle}
      </a>
    </div>
  );
}
