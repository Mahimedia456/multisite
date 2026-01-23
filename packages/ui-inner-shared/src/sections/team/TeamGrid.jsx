// apps/aamir/src/sections/team/TeamGrid.jsx
export default function TeamGrid({ members = [] }) {
  return (
    <section className="py-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {members.map((m, i) => (
          <div
            key={i}
            className="group flex flex-col gap-3 pb-6 bg-white dark:bg-[#1a2d2a] rounded-xl p-3 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="w-full aspect-[4/5] rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-800">
              {m?.image?.url ? (
                <img
                  alt={m?.image?.alt || m?.name || "Team member"}
                  className="w-full h-full object-cover"
                  src={m.image.url}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-5xl">person</span>
                </div>
              )}

              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="px-1">
              <p className="text-[#111717] dark:text-white text-lg font-bold leading-tight">
                {m?.name || ""}
              </p>
              <p className="text-primary font-medium text-sm mt-1 uppercase tracking-wider">
                {m?.role || ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
