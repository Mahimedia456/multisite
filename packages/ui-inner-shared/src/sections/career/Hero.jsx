// packages/ui-inner-shared/src/sections/career/Hero.jsx
const FALLBACK_BG = "https://source.unsplash.com/1600x900/?office,modern";

function safeStr(v) {
  return typeof v === "string" ? v.trim() : "";
}
function safeImgSrc(url, fallback) {
  const u = safeStr(url);
  return u ? u : fallback;
}

export default function Hero({
  title = "Starten Sie Ihre Karriere bei der Nr. 1 Allianz Versicherung in Berlin.",
  subtitle = "",
  primary = { label: "Zu den Jobs", href: "#jobs" },
  secondary = { label: "Team kennenlernen", href: "/team" },
  backgroundImage,
  overlay = { from: "rgba(0,0,0,0.35)", to: "rgba(0,0,0,0.65)" },
}) {
  const bgSrc = safeImgSrc(backgroundImage?.url, FALLBACK_BG);

  return (
    <section className="py-10">
      <div className="relative overflow-hidden rounded-3xl min-h-[420px] flex items-center justify-start p-8 md:p-12">
        <div className="absolute inset-0">
          <img
            alt={backgroundImage?.alt || "Career hero background"}
            className="w-full h-full object-cover"
            src={bgSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_BG;
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${overlay?.from || "rgba(0,0,0,0.35)"}, ${
                overlay?.to || "rgba(0,0,0,0.65)"
              })`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-white text-4xl md:text-6xl font-black leading-[1.02] tracking-[-0.03em]">
            {title}
          </h1>

          <p className="text-white/90 text-base md:text-lg mt-4 max-w-xl">
            {subtitle}
          </p>

          <div className="flex gap-4 flex-wrap mt-7">
            <a
              href={primary?.href || "#"}
              className="bg-white text-[#111717]
                         px-8 py-3 rounded-xl font-bold
                         hover:bg-white/90 hover:scale-105
                         transition-transform inline-flex items-center justify-center"
            >
              {primary?.label || ""}
            </a>

            <a
              href={secondary?.href || "#"}
              className="bg-white/10 backdrop-blur-md
                         text-white border border-white/20
                         px-8 py-3 rounded-xl font-bold
                         hover:bg-white/20 transition-all
                         inline-flex items-center justify-center"
            >
              {secondary?.label || ""}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
