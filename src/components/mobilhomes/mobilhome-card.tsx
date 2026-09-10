import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, Ruler } from "lucide-react";
import type { MobilHome } from "@/types/mobilhome";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { StatusBadge } from "@/components/mobilhomes/status-badge";
import { formatPrice, getDisplayPrice } from "@/lib/utils/price";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

export function MobilHomeCard({
  mobilHome,
  locale,
  dict,
}: {
  mobilHome: MobilHome;
  locale: Locale;
  dict: Dictionary;
}) {
  const cover = mobilHome.images[0];
  const { amount, vatLabel } = getDisplayPrice(mobilHome);
  const href = `/${locale}/mobilhomes/${mobilHome.slug[locale]}`;

  return (
    <Card className="group overflow-hidden border-border/70 py-0 transition-shadow hover:shadow-lg">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt || mobilHome.title[locale]}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {dict.mobilhome.reference}
            </div>
          )}
          <StatusBadge status={mobilHome.status} dict={dict} className="absolute left-3 top-3 bg-white" />
        </div>
      </Link>
      <CardContent className="space-y-2 px-4 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
          {mobilHome.brand} · {mobilHome.model}
        </p>
        <Link href={href}>
          <h3 className="line-clamp-1 font-heading text-lg font-semibold text-brand-anthracite">
            {mobilHome.title[locale]}
          </h3>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {mobilHome.publicLocation}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" /> {mobilHome.surface} m²
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {mobilHome.bedrooms}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between px-4 pb-4">
        <div>
          <span className="font-heading text-xl font-bold text-brand-anthracite">
            {formatPrice(amount, mobilHome.currency)}
          </span>
          {vatLabel && (
            <span className="ml-1 text-xs text-muted-foreground">
              {dict.mobilhome[vatLabel]}
            </span>
          )}
        </div>
        <ButtonLink href={href} size="sm" variant="outline">
          {dict.catalog.viewMobilhome}
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
