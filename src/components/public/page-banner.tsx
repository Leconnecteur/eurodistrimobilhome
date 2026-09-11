import Image from "next/image";

export function PageBanner({
  image,
  title,
  subtitle,
}: {
  image: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative flex h-56 items-center overflow-hidden bg-brand-anthracite md:h-72">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-anthracite/80 via-brand-anthracite/40 to-brand-anthracite/20" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
