// packages/ui-inner-shared/src/sections/career/Steps.jsx
export default function Steps({ title, subtitle, items = [] }) {
  return (
    <section className="py-10 bg-[#eef6f4] rounded-3xl">
      <div className="text-center px-6">
        <h2 className="text-2xl md:text-3xl font-black">{title || ""}</h2>
        <p className="text-gray-600 mt-2">{subtitle || ""}</p>
      </div>

      <div className="mt-10 px-6 grid md:grid-cols-3 gap-8">
        {items.map((it, i) => (
          <div key={i} className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined">{it?.icon || "check"}</span>
            </div>
            <h3 className="font-black mt-4">{it?.title || ""}</h3>
            <p className="text-gray-600 mt-2 text-sm">{it?.body || ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
