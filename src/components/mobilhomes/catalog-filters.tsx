"use client";

import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

const selectClassName =
  "h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const KEY_EQUIPMENT = ["airConditioning", "terrace", "heating", "furnished"] as const;

export function CatalogFilters({
  dict,
  brands,
  countries,
}: {
  dict: Dictionary;
  brands: string[];
  countries: string[];
}) {
  const searchParams = useSearchParams();
  const get = (key: string) => searchParams.get(key) ?? "";
  const selectedEquipment = searchParams.getAll("equipment");

  return (
    <form
      method="get"
      className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-center"
    >
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          name="q"
          placeholder={dict.catalog.search}
          defaultValue={get("q")}
          className="pl-9"
        />
      </div>

      <select name="brand" defaultValue={get("brand")} className={selectClassName}>
        <option value="">{dict.catalog.allBrands}</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select name="country" defaultValue={get("country")} className={selectClassName}>
        <option value="">{dict.catalog.allCountries}</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select name="bedrooms" defaultValue={get("bedrooms")} className={selectClassName}>
        <option value="">{dict.catalog.bedrooms}</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}+
          </option>
        ))}
      </select>

      <select name="status" defaultValue={get("status")} className={selectClassName}>
        <option value="">{dict.catalog.allStatuses}</option>
        <option value="AVAILABLE">{dict.status.AVAILABLE}</option>
        <option value="RESERVED">{dict.status.RESERVED}</option>
        <option value="SOLD">{dict.status.SOLD}</option>
      </select>

      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          name="minPrice"
          min={0}
          placeholder="Prix min"
          defaultValue={get("minPrice")}
          className="w-24"
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          name="maxPrice"
          min={0}
          placeholder="Prix max"
          defaultValue={get("maxPrice")}
          className="w-24"
        />
      </div>

      <select name="sort" defaultValue={get("sort") || "recent"} className={selectClassName}>
        <option value="recent">{dict.catalog.sortRecent}</option>
        <option value="price-asc">{dict.catalog.sortPriceAsc}</option>
        <option value="price-desc">{dict.catalog.sortPriceDesc}</option>
        <option value="surface-desc">{dict.catalog.sortSurfaceDesc}</option>
      </select>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 basis-full">
        {KEY_EQUIPMENT.map((key) => (
          <label key={key} className="flex items-center gap-1.5 text-sm text-brand-anthracite">
            <input
              type="checkbox"
              name="equipment"
              value={key}
              defaultChecked={selectedEquipment.includes(key)}
              className="h-4 w-4 rounded border-input accent-brand-gold"
            />
            {dict.equipmentLabels[key]}
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="bg-brand-anthracite text-white hover:bg-brand-anthracite/90">
          {dict.catalog.apply}
        </Button>
        <ButtonLink href="?" variant="outline">
          {dict.catalog.reset}
        </ButtonLink>
      </div>
    </form>
  );
}
