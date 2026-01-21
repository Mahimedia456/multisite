// apps/aamir/src/sections/about/Hero.jsx
const FALLBACK_HERO_BG = "https://source.unsplash.com/1600x900/?dog,owner,park";
const FALLBACK_AVATAR_1 = "https://source.unsplash.com/200x200/?woman,portrait";
const FALLBACK_AVATAR_2 = "https://source.unsplash.com/200x200/?man,portrait";

function safeImgSrc(url, fallback) {
  const u = typeof url === "string" ? url.trim() : "";
  return u ? u : fallback;
}

export default function Hero({
  badge = { icon: "favorite", label: "Our Heart & Soul" },
  title = { before: "Born from a Love for", highlight: "Furry Family", after: "." },
  description,
  backgroundImage,
  founders = {
    name: "Sarah & Michael Jenkins",
    role: "Founders & Pet Parents",
    avatars: [],
  },
}) {
  const bgSrc = safeImgSrc(backgroundImage?.url, FALLBACK_HERO_BG);

  return (
    <header className="relative min-h-[700px] flex items-center overflow-hidden rounded-3xl">
      <div className="absolute inset-0 z-0">
        <img
          alt={backgroundImage?.alt || "About hero background"}
          className="w-full h-full object-cover"
          src={bgSrc}
          onError={(e) => {
            // prevent infinite loop
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_HERO_BG;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full py-20 lg:py-32 px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white border border-white/20 w-fit mb-8">
            <span className="material-symbols-outlined text-sm text-secondary">
              {badge.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              {badge.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
            {title.before} <span className="text-primary">{title.highlight}</span>
            {title.after}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10">
            {description}
          </p>

          <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-fit">
            <div className="flex -space-x-3">
              {(founders.avatars || []).map((a, idx) => {
                const fallback = idx === 0 ? FALLBACK_AVATAR_1 : FALLBACK_AVATAR_2;
                const src = safeImgSrc(a?.url, fallback);

                return (
                  <img
                    key={idx}
                    alt={a?.alt || `Founder ${idx + 1}`}
                    className="w-14 h-14 rounded-full border-2 border-primary object-cover bg-white/10"
                    src={src}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallback;
                    }}
                  />
                );
              })}
            </div>

            <div>
              <p className="text-base font-bold text-white">{founders.name}</p>
              <p className="text-sm text-white/70">{founders.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
