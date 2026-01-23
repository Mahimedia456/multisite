// packages/ui-inner-shared/src/sections/career/Why.jsx
export default function Why({ title, subtitle, cards = [] }) {
  return (
    <section className="py-6">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black">{title || ""}</h2>
        <p className="text-gray-600 mt-2 max-w-3xl">{subtitle || ""}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">{c?.icon || "star"}</span>
            </div>
            <h3 className="font-bold text-lg">{c?.title || ""}</h3>
            <p className="text-gray-600 mt-2">{c?.body || ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
