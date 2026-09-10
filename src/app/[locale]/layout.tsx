import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, LOCALES } from "@/lib/i18n/config";
import { getCompanySettings } from "@/lib/data/settings";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: "Euro Distri Mobilhome",
      template: "%s | Euro Distri Mobilhome",
    },
    description:
      "Achat, vente, reprise et distribution de mobil-homes d'occasion en France, Espagne et Portugal.",
    alternates: {
      languages: {
        fr: "/fr",
        es: "/es",
        pt: "/pt",
      },
    },
    openGraph: {
      type: "website",
      locale,
      siteName: "Euro Distri Mobilhome",
      images: ["/demo/og-default.svg"],
    },
  };
}

export default async function LocaleLayout(
  props: LayoutProps<"/[locale]">
) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();

  const [dict, settings] = await Promise.all([
    getDictionary(locale),
    getCompanySettings(),
  ]);

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider delay={200}>
          <Header locale={locale} dict={dict} />
          <main className="flex-1">{props.children}</main>
          <Footer locale={locale} dict={dict} settings={settings} />
        </TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
