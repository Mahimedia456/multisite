export default function ContactMap({
  mapUrl = "https://maps.google.com/maps?q=Offheimer%20Weg%2036%2065549%20Limburg&t=m&z=10&output=embed&iwloc=near",
}) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
          <iframe
            title="map"
            src={mapUrl}
            className="h-[440px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}