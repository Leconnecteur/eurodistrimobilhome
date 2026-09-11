import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe2, HeartHandshake, ShieldCheck } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PageBanner } from "@/components/public/page-banner";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  return {
    title: dict.about.title,
    description: dict.about.intro,
    alternates: { canonical: `/${locale}/a-propos` },
  };
}

export default async function AboutPage(props: PageProps<"/[locale]/a-propos">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const values = [
    { icon: ShieldCheck, title: dict.about.value1Title, text: dict.about.value1Text },
    { icon: Globe2, title: dict.about.value2Title, text: dict.about.value2Text },
    { icon: HeartHandshake, title: dict.about.value3Title, text: dict.about.value3Text },
  ];

  return (
    <div>
      <PageBanner
        image="/images/banner-about.jpg"
        title={dict.about.title}
        subtitle={dict.about.intro}
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-brand-anthracite">
            {dict.about.missionTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{dict.about.missionText}</p>
        </div>

        <h2 className="mt-16 mb-6 text-center font-heading text-2xl font-bold text-brand-anthracite">
          {dict.about.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
              <value.icon className="mx-auto mb-3 h-8 w-8 text-brand-gold" />
              <h3 className="font-heading text-lg font-semibold text-brand-anthracite">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
