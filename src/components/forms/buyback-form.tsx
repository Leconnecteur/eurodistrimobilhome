"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { buybackFormSchema, MAX_BUYBACK_IMAGES } from "@/lib/validation/buyback.schema";
import { submitBuybackRequest } from "@/lib/firebase/public-writes";
import { uploadImage } from "@/lib/firebase/uploads";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ImageUploader, type LocalImage } from "@/components/forms/image-uploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function BuybackForm({ dict }: { dict: Dictionary }) {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkboxes, setCheckboxes] = useState({
    terrace: false,
    airConditioning: false,
    heating: false,
    furnished: false,
    consent: false,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      brand: String(formData.get("brand") || ""),
      model: String(formData.get("model") || ""),
      year: String(formData.get("year") || ""),
      surface: String(formData.get("surface") || ""),
      bedrooms: String(formData.get("bedrooms") || ""),
      bathrooms: String(formData.get("bathrooms") || ""),
      city: String(formData.get("city") || ""),
      country: String(formData.get("country") || ""),
      condition: String(formData.get("condition") || "GOOD"),
      description: String(formData.get("description") || ""),
      desiredPrice: formData.get("desiredPrice") ? String(formData.get("desiredPrice")) : undefined,
      otherEquipment: String(formData.get("otherEquipment") || ""),
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      sellerCountry: String(formData.get("sellerCountry") || ""),
      sellerCity: String(formData.get("sellerCity") || ""),
      website: String(formData.get("website") || ""),
      ...checkboxes,
    };

    const parsed = buybackFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(dict.sell.error);
      return;
    }
    if (parsed.data.website) return; // honeypot

    setErrors({});
    setStatus("sending");
    try {
      const requestId = String(Date.now());
      const uploadedImages = isFirebaseConfigured
        ? await Promise.all(
            images.map((img) => uploadImage(img.file, "buyback-uploads/" + requestId))
          )
        : [];

      await submitBuybackRequest({
        brand: parsed.data.brand,
        model: parsed.data.model,
        year: parsed.data.year,
        surface: parsed.data.surface,
        bedrooms: parsed.data.bedrooms,
        bathrooms: parsed.data.bathrooms,
        city: parsed.data.city,
        country: parsed.data.country,
        condition: parsed.data.condition,
        description: parsed.data.description,
        desiredPrice: parsed.data.desiredPrice ?? null,
        terrace: parsed.data.terrace,
        airConditioning: parsed.data.airConditioning,
        heating: parsed.data.heating,
        furnished: parsed.data.furnished,
        otherEquipment: parsed.data.otherEquipment ?? "",
        images: uploadedImages,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        company: parsed.data.company,
        email: parsed.data.email,
        phone: parsed.data.phone,
        sellerCountry: parsed.data.sellerCountry,
        sellerCity: parsed.data.sellerCity,
        consent: parsed.data.consent,
      });
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error(dict.sell.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-status-available/30 bg-status-available/5 p-8 text-center">
        <h3 className="font-heading text-xl font-semibold text-status-available">
          {dict.sell.successTitle}
        </h3>
        <p className="mt-2 text-muted-foreground">{dict.sell.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <section>
        <h3 className="mb-4 font-heading text-lg font-semibold text-brand-anthracite">
          {dict.sell.mobilhomeSection}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="brand" className="mb-1.5">{dict.sell.brand}</Label>
            <Input id="brand" name="brand" required />
            {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand}</p>}
          </div>
          <div>
            <Label htmlFor="model" className="mb-1.5">{dict.sell.model}</Label>
            <Input id="model" name="model" required />
            {errors.model && <p className="mt-1 text-xs text-destructive">{errors.model}</p>}
          </div>
          <div>
            <Label htmlFor="year" className="mb-1.5">{dict.sell.year}</Label>
            <Input id="year" name="year" type="number" min={1970} max={2030} required />
            {errors.year && <p className="mt-1 text-xs text-destructive">{errors.year}</p>}
          </div>
          <div>
            <Label htmlFor="surface" className="mb-1.5">{dict.sell.surface}</Label>
            <Input id="surface" name="surface" type="number" step="0.1" min={0} required />
            {errors.surface && <p className="mt-1 text-xs text-destructive">{errors.surface}</p>}
          </div>
          <div>
            <Label htmlFor="bedrooms" className="mb-1.5">{dict.sell.bedrooms}</Label>
            <Input id="bedrooms" name="bedrooms" type="number" min={0} required />
          </div>
          <div>
            <Label htmlFor="bathrooms" className="mb-1.5">{dict.sell.bathrooms}</Label>
            <Input id="bathrooms" name="bathrooms" type="number" min={0} required />
          </div>
          <div>
            <Label htmlFor="city" className="mb-1.5">{dict.sell.city}</Label>
            <Input id="city" name="city" required />
          </div>
          <div>
            <Label htmlFor="country" className="mb-1.5">{dict.sell.country}</Label>
            <Input id="country" name="country" required />
          </div>
          <div>
            <Label htmlFor="condition" className="mb-1.5">{dict.sell.condition}</Label>
            <select id="condition" name="condition" className={selectClassName} defaultValue="GOOD">
              <option value="EXCELLENT">{dict.condition.EXCELLENT}</option>
              <option value="VERY_GOOD">{dict.condition.VERY_GOOD}</option>
              <option value="GOOD">{dict.condition.GOOD}</option>
              <option value="TO_RENOVATE">{dict.condition.TO_RENOVATE}</option>
            </select>
          </div>
          <div>
            <Label htmlFor="desiredPrice" className="mb-1.5">{dict.sell.desiredPrice}</Label>
            <Input id="desiredPrice" name="desiredPrice" type="number" min={0} />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="description" className="mb-1.5">{dict.sell.description}</Label>
          <Textarea id="description" name="description" rows={4} />
          {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
        </div>

        <div className="mt-4 flex flex-wrap gap-6">
          {(
            [
              ["terrace", dict.sell.terrace],
              ["airConditioning", dict.sell.airConditioning],
              ["heating", dict.sell.heating],
              ["furnished", dict.sell.furnished],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-brand-anthracite">
              <Checkbox
                checked={checkboxes[key]}
                onCheckedChange={(checked) =>
                  setCheckboxes((prev) => ({ ...prev, [key]: checked === true }))
                }
              />
              {label}
            </label>
          ))}
        </div>

        <div className="mt-4">
          <Label htmlFor="otherEquipment" className="mb-1.5">{dict.sell.otherEquipment}</Label>
          <Input id="otherEquipment" name="otherEquipment" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-heading text-lg font-semibold text-brand-anthracite">
          {dict.sell.photosSection}
        </h3>
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={MAX_BUYBACK_IMAGES}
          label={dict.sell.addPhotos}
          countLabel={dict.sell.photosCount}
        />
      </section>

      <section>
        <h3 className="mb-4 font-heading text-lg font-semibold text-brand-anthracite">
          {dict.sell.sellerSection}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="mb-1.5">{dict.sell.firstName}</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-1.5">{dict.sell.lastName}</Label>
            <Input id="lastName" name="lastName" required />
          </div>
          <div>
            <Label htmlFor="company" className="mb-1.5">{dict.sell.company}</Label>
            <Input id="company" name="company" />
          </div>
          <div>
            <Label htmlFor="buyback-email" className="mb-1.5">{dict.sell.email}</Label>
            <Input id="buyback-email" name="email" type="email" required />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="buyback-phone" className="mb-1.5">{dict.sell.phone}</Label>
            <Input id="buyback-phone" name="phone" type="tel" required />
          </div>
          <div>
            <Label htmlFor="sellerCountry" className="mb-1.5">{dict.sell.sellerCountry}</Label>
            <Input id="sellerCountry" name="sellerCountry" required />
          </div>
          <div>
            <Label htmlFor="sellerCity" className="mb-1.5">{dict.sell.sellerCity}</Label>
            <Input id="sellerCity" name="sellerCity" required />
          </div>
        </div>
      </section>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <Checkbox
          checked={checkboxes.consent}
          onCheckedChange={(checked) =>
            setCheckboxes((prev) => ({ ...prev, consent: checked === true }))
          }
        />
        <span>{dict.sell.consent}</span>
      </label>
      {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="w-full bg-brand-anthracite text-white hover:bg-brand-anthracite/90 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {dict.sell.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {dict.sell.submit}
          </>
        )}
      </Button>
    </form>
  );
}
