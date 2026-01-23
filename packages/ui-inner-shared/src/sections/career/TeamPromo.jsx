// packages/ui-inner-shared/src/sections/career/TeamPromo.jsx
export default function TeamPromo({
  title,
  body,
  primary = { label: "Alle Teammitglieder ansehen", href: "/team", icon: "trending_flat" },
  image,
}) {
  return (
    <section className="py-10">
      <div className="rounded-3xl bg-[#dff5f1] p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#111717]">{title || ""}</h2>
          <p className="text-[#111717]/70 mt-3 max-w-xl">{body || ""}</p>

          <a
            href={primary?.href || "/team"}
            className="mt-6 inline-flex items-center gap-2 font-bold text-[#111717] hover:opacity-80"
          >
            {primary?.label || "Alle Teammitglieder ansehen"}
            <span className="material-symbols-outlined">{primary?.icon || "trending_flat"}</span>
          </a>
        </div>

        <div className="rounded-3xl overflow-hidden bg-white shadow-sm border border-white/60">
          {image?.url ? (
            <img alt={image?.alt || "Team promo"} src={image.url} className="w-full h-[260px] object-cover" />
          ) : (
            <div className="w-full h-[260px] bg-white/60" />
          )}
        </div>
      </div>
    </section>
  );
}
