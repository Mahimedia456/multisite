export default function ContactMap({
  eyebrow = "Standort",
  title = "Besuchen Sie uns vor Ort",
  description = "Unser Team ist persönlich für Sie erreichbar. Nutzen Sie die Karte für die direkte Anfahrt.",
  mapUrl = "https://maps.google.com/maps?q=Offheimer%20Weg%2036%2065549%20Limburg&t=m&z=10&output=embed&iwloc=near",
}) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            {title}
          </h2>

          <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
            {description}
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          <iframe
            title="map"
            src={mapUrl}
            className="h-[460px] w-full rounded-[1.5rem]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}