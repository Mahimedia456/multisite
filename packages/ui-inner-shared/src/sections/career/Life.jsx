// packages/ui-inner-shared/src/sections/career/Life.jsx
export default function Life({ title, subtitle, images = [] }) {
  return (
    <section className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black">{title || ""}</h2>
        <p className="text-gray-600 mt-2">{subtitle || ""}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {images.map((img, i) => (
          <div key={i} className="rounded-3xl overflow-hidden bg-white border border-gray-100">
            <img alt={img?.alt || "Life image"} src={img?.url || ""} className="w-full h-[260px] object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
