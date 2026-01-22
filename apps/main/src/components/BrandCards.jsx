// BrandCards.jsx
const CARDS = [
  {
    id: "aamir",
    title: "Haustierpflege",
    icon: "pets",
    desc:
      "Comprehensive health and wellness protection for your companions. Tailored plans that evolve as they do.",
    href: "https://petcare-azure.vercel.app/",
  },
  {
    id: "umair",
    title: "Familienerbe",
    icon: "family_restroom",
    desc:
      "Securing your family's future through generational wealth protection and comprehensive life coverage.",
    href: "https://trustlife-ten.vercel.app/",
  },
];

export default function BrandCards() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 -mt-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CARDS.map((c) => (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-xl p-8 flex flex-col gap-6 group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-4xl">{c.icon}</span>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-2">{c.title}</h3>
              <p className="text-[#665a73] dark:text-[#a195ad] leading-relaxed">
                {c.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <span className="text-primary font-bold inline-flex items-center gap-2">
                Explore <span className="material-symbols-outlined text-sm">open_in_new</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
