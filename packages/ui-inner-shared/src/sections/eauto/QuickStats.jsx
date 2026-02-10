export default function QuickStats({
  items = [
    { label: "Haftpflicht ab", price: "119€", suffix: "/ Jahr" },
    { label: "Teilkasko ab", price: "179€", suffix: "/ Jahr" },
    { label: "Vollkasko ab", price: "199€", suffix: "/ Jahr" },
  ],
}) {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
        {items.map((it, idx) => (
          <div
            key={idx}
            className={[
              "flex flex-col items-center justify-center p-8 bg-white",
              idx !== items.length - 1
                ? "border-b md:border-b-0 md:border-r border-slate-100"
                : "",
            ].join(" ")}
          >
            <p className="text-slate-500 text-sm font-medium mb-1">{it.label}</p>
            <p className="text-slate-900 text-3xl font-black">
              {it.price}{" "}
              <span className="text-sm font-normal text-slate-400">
                {it.suffix}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
