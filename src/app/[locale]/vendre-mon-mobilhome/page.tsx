import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { BuybackForm } from "@/components/forms/buyback-form";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  return {
    title: dict.sell.heroTitle,
    description: dict.sell.heroSubtitle,
    alternates: { canonical: `/${locale}/vendre-mon-mobilhome` },
  };
}

export default async function SellPage(props: PageProps<"/[locale]/vendre-mon-mobilhome">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const steps = [dict.sell.process1, dict.sell.process2, dict.sell.process3, dict.sell.process4];

  return (
    <div>
      <section className="bg-brand-cream/50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-brand-anthracite md:text-4xl">
            {dict.sell.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{dict.sell.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center font-heading text-xl font-semibold text-brand-anthracite">
          {dict.sell.processTitle}
        </h2>
        <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-4 text-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold font-heading font-bold text-brand-anthracite">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-10">
          <div className="mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-brand-gold" />
            <h2 className="font-heading text-xl font-semibold text-brand-anthracite">
              {dict.sell.formTitle}
            </h2>
          </div>
          <BuybackForm dict={dict} />
        </div>
      </section>
    </div>
  );
}
