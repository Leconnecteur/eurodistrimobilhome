import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCompanySettings } from "@/lib/data/settings";
import { ContactForm } from "@/components/forms/contact-form";
import { PageBanner } from "@/components/public/page-banner";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const dict = await getDictionary(isLocale(locale) ? locale : "fr");
  return {
    title: dict.contact.title,
    description: dict.contact.subtitle,
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage(props: PageProps<"/[locale]/contact">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const [dict, settings] = await Promise.all([getDictionary(locale), getCompanySettings()]);

  return (
    <div>
      <PageBanner
        image="/images/banner-contact.jpg"
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm md:col-span-1">
          <h2 className="mb-4 font-heading text-lg font-semibold text-brand-anthracite">
            {dict.contact.infoTitle}
          </h2>
          <div className="space-y-4 text-sm">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <span>
                <span className="block font-medium text-brand-anthracite">
                  {dict.contact.addressLabel}
                </span>
                {settings.address}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <span>
                <span className="block font-medium text-brand-anthracite">
                  {dict.contact.phoneLabel}
                </span>
                <a href={`tel:${settings.phone}`} className="hover:text-brand-gold">
                  {settings.phone}
                </a>
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <span>
                <span className="block font-medium text-brand-anthracite">
                  {dict.contact.emailLabel}
                </span>
                <a href={`mailto:${settings.email}`} className="hover:text-brand-gold">
                  {settings.email}
                </a>
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm md:col-span-2">
          <ContactForm dict={dict} />
        </div>
      </div>
      </div>
    </div>
  );
}
