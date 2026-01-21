// apps/aamir/src/sections/about/TeamGrid.jsx
export default function TeamGrid({
  title = "The Humans (and Pets) Behind PetGuard",
  subtitle = "Led by a group of industry experts who all share one thing: an obsession with their pets.",
  members = [],
  badgeIcon = "pets",
}) {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-surface-dark rounded-3xl">
      <div className="px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white mb-6">{title}</h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {members.map((m, i) => (
            <div
              key={i}
              className="bg-background-light dark:bg-background-dark p-8 rounded-[2.5rem] shadow-soft hover:shadow-lg transition-all text-center group"
            >
              <div className="w-40 h-40 mx-auto mb-8 relative">
                {m.image?.url ? (
                  <img
                    alt={m.image?.alt || m.name}
                    className="w-full h-full object-cover rounded-3xl"
                    src={m.image.url}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 text-6xl">person</span>
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-full border-4 border-white dark:border-surface-dark shadow-sm">
                  <span className="material-symbols-outlined text-base">{badgeIcon}</span>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-text-main dark:text-white">{m.name}</h4>
              <p className="text-primary font-semibold text-base mb-3">{m.role}</p>
              <p className="text-sm text-text-muted italic">
                {m.petLinePrefix || "Proud"}{" "}
                <span className="text-text-main dark:text-white font-medium">{m.petLineHighlight}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
