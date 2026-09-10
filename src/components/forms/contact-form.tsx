"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema } from "@/lib/validation/contact.schema";
import { submitLead } from "@/lib/firebase/public-writes";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      subject: String(formData.get("subject") || "GENERAL"),
      message: String(formData.get("message") || ""),
      website: String(formData.get("website") || ""),
    };

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    if (parsed.data.website) return;

    setErrors({});
    setStatus("sending");
    try {
      await submitLead({
        type: "CONTACT",
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
        source: "website",
      });
      setStatus("sent");
      toast.success(dict.contact.success);
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error(dict.contact.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-status-available/30 bg-status-available/5 p-4 text-sm text-status-available">
        {dict.contact.success}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <Label htmlFor="name" className="mb-1.5">
          {dict.contact.name}
        </Label>
        <Input id="name" name="name" required />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email" className="mb-1.5">
            {dict.contact.email}
          </Label>
          <Input id="email" name="email" type="email" required />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="mb-1.5">
            {dict.contact.phone}
          </Label>
          <Input id="phone" name="phone" type="tel" required />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="subject" className="mb-1.5">
          {dict.contact.subject}
        </Label>
        <select id="subject" name="subject" className={selectClassName} defaultValue="GENERAL">
          <option value="GENERAL">{dict.contact.subjectGeneral}</option>
          <option value="MOBILHOME_AVAILABLE">{dict.contact.subjectMobilhome}</option>
          <option value="SELL_MOBILHOME">{dict.contact.subjectSell}</option>
          <option value="DELIVERY">{dict.contact.subjectDelivery}</option>
          <option value="OTHER">{dict.contact.subjectOther}</option>
        </select>
      </div>
      <div>
        <Label htmlFor="message" className="mb-1.5">
          {dict.contact.message}
        </Label>
        <Textarea id="message" name="message" rows={5} required />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button
        type="submit"
        disabled={status === "sending"}
        size="lg"
        className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {dict.contact.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {dict.contact.submit}
          </>
        )}
      </Button>
    </form>
  );
}
