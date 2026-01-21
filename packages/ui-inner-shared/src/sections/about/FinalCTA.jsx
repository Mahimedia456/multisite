export default function FinalCTA({ title, primary, secondary }) {
  return (
    <section className="text-center py-20">
      <h2 className="text-4xl font-black mb-6">{title || ""}</h2>

      <div className="flex justify-center gap-4 flex-wrap">
        <a
          href={primary?.href || "#"}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold inline-flex items-center justify-center"
        >
          {primary?.label || ""}
        </a>

        <a
          href={secondary?.href || "#"}
          className="bg-white/60 px-10 py-4 rounded-2xl font-bold inline-flex items-center justify-center"
        >
          {secondary?.label || ""}
        </a>
      </div>
    </section>
  );
}
