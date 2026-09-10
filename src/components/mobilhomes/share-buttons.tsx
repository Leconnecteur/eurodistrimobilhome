"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { FacebookIcon } from "@/components/public/social-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ShareButtons({
  url,
  title,
  dict,
}: {
  url: string;
  title: string;
  dict: Dictionary;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(dict.mobilhome.shareCopied);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <Share2 className="h-4 w-4" />
        {dict.mobilhome.share}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          render={
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <FacebookIcon className="h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {dict.mobilhome.copyLink}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
