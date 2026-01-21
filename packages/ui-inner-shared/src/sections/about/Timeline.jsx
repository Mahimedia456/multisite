// apps/aamir/src/sections/about/Timeline.jsx
export default function Timeline({
  kicker = "Our Story",
  title = "Our Journey So Far",
  items = [],
}) {
  return (
    <section className="py-24 md:py-32 bg-background-light dark:bg-background-dark overflow-hidden rounded-3xl">
      <div className="px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            {kicker}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white">
            {title}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 -translate-x-1/2 hidden md:block" />

          <div className="space-y-20 md:space-y-28">
            {items.map((it, idx) => {
              const isRight = idx % 2 === 1;

              const dotClass =
                it.variant === "secondary"
                  ? "bg-secondary ring-secondary/10"
                  : "bg-primary ring-primary/10";

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center"
                >
                  {/* LEFT */}
                  <div className="md:pr-12">
                    {!isRight && <Card item={it} align="right" />}
                  </div>

                  {/* CENTER DOT */}
                  <div className="relative flex items-center justify-center my-8 md:my-0">
                    <div
                      className={[
                        "w-4 h-4 rounded-full ring-8 z-10",
                        dotClass,
                      ].join(" ")}
                    />
                  </div>

                  {/* RIGHT */}
                  <div className="md:pl-12">
                    {isRight && <Card item={it} align="left" />}
                  </div>

                  {/* MOBILE CARD */}
                  <div className="md:hidden mt-6">
                    <Card item={it} align="left" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- */

function Card({ item, align }) {
  const yearColor =
    item.variant === "secondary"
      ? "text-secondary/40"
      : "text-primary/40";

  const iconBase =
    item.variant === "secondary"
      ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white";

  return (
    <div
      className={[
        "bg-white dark:bg-surface-dark p-8 rounded-3xl border border-primary/10 shadow-soft hover:shadow-xl transition-all duration-300 group",
        align === "right" ? "md:text-right" : "",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-4 mb-4",
          align === "right" ? "md:flex-row-reverse" : "",
        ].join(" ")}
      >
        <div
          className={[
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
            iconBase,
          ].join(" ")}
        >
          <span className="material-symbols-outlined">
            {item.icon}
          </span>
        </div>

        <span className={`text-2xl font-black ${yearColor}`}>
          {item.year}
        </span>
      </div>

      <h4 className="text-xl font-bold text-text-main dark:text-white mb-3">
        {item.title}
      </h4>

      <p className="text-text-muted leading-relaxed">
        {item.body}
      </p>
    </div>
  );
}
