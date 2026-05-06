const DEFAULT_STATS = [
  { value: "4.673+", label: "Glückliche Kunden" },
  { value: "29.821", label: "Operationen gesichert" },
  { value: "97,8%", label: "Zusagequote" },
  { value: "24/7", label: "Notfall-Service" },
];

export default function AboutStats({ items = DEFAULT_STATS }) {
  const stats = Array.isArray(items) && items.length ? items : DEFAULT_STATS;

  return (
    <section className="bg-white py-10 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-primary mb-1">
                {s.value}
              </div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}