"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { mobilHomeContactSchema } from "@/lib/validation/contact.schema";
import { submitLead } from "@/lib/firebase/public-writes";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function MobilHomeContactForm({
  dict,
  mobileHomeId,
  mobileHomeReference,
  defaultMessage,
}: {
  dict: Dictionary;
  mobileHomeId: string;
  mobileHomeReference: string;
  defaultMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      mobileHomeId,
      mobileHomeReference,
      website: String(formData.get("website") || ""),
    };

    const parsed = mobilHomeContactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    if (parsed.data.website) return; // honeypot triggered, silently drop

    setErrors({});
    setStatus("sending");
    try {
      await submitLead({
        type: "MOBILHOME_INFO",
        name: `${parsed.data.firstName} ${parsed.data.lastName}`,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        mobileHomeId: parsed.data.mobileHomeId,
        mobileHomeReference: parsed.data.mobileHomeReference,
        source: "website",
      });
      setStatus("sent");
      toast.success(dict.mobilhome.sent);
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error(dict.mobilhome.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-status-available/30 bg-status-available/5 p-4 text-sm text-status-available">
        {dict.mobilhome.sent}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot field, hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName" className="mb-1.5">
            {dict.mobilhome.firstName}
          </Label>
          <Input id="firstName" name="firstName" required />
          {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName" className="mb-1.5">
            {dict.mobilhome.lastName}
          </Label>
          <Input id="lastName" name="lastName" required />
          {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="mb-1.5">
          {dict.mobilhome.email}
        </Label>
        <Input id="email" name="email" type="email" required />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="phone" className="mb-1.5">
          {dict.mobilhome.phone}
        </Label>
        <Input id="phone" name="phone" type="tel" required />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
      </div>
      <div>
        <Label htmlFor="message" className="mb-1.5">
          {dict.mobilhome.message}
        </Label>
        <Textarea id="message" name="message" rows={4} defaultValue={defaultMessage} required />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {dict.mobilhome.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {dict.mobilhome.send}
          </>
        )}
      </Button>
    </form>
  );
}
