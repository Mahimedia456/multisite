// apps/aamir/src/sections/team/Benefits.jsx
export default function Benefits({
  title = "Ihre Vorteile",
  subtitle = "Warum Kunden seit Jahrzehnten auf Allianz Kundler vertrauen.",
  items = [],
}) {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a2d2a] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#1e2e2c] flex flex-col items-center text-center group hover:border-primary transition-all"
          >
            <div className="size-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">{it?.icon || "star"}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{it?.title || ""}</h3>
            <p className="text-gray-600 dark:text-gray-400">{it?.body || ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
