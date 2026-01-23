// apps/aamir/src/sections/team/CareerCTA.jsx
export default function CareerCTA({
  title = "Werde Teil unseres Teams",
  body = "",
  primary = { label: "Jetzt bewerben", href: "#", icon: "trending_flat" },
}) {
  return (
    <section className="py-16">
      <div className="bg-primary rounded-3xl p-12 text-center text-white flex flex-col items-center">
        <h2 className="text-4xl font-black mb-4 text-white">
          {title}
        </h2>

        <p className="text-lg max-w-xl mb-8 font-medium text-white/90">
          {body}
        </p>

        <a
          href={primary?.href || "#"}
          className="bg-white text-[#11211f]
                     px-10 py-4 rounded-xl font-bold text-lg
                     hover:bg-white/90 hover:scale-105
                     transition-transform inline-flex items-center gap-2"
        >
          {primary?.label || ""}
          <span className="material-symbols-outlined">
            {primary?.icon || "trending_flat"}
          </span>
        </a>
      </div>
    </section>
  );
}
