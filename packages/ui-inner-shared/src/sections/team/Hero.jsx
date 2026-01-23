const FALLBACK_BG = "https://source.unsplash.com/1600x900/?office,modern";

function safeStr(v) {
  return typeof v === "string" ? v.trim() : "";
}

function safeImgSrc(url, fallback) {
  const u = safeStr(url);
  return u ? u : fallback;
}

export default function Hero({
  title = "Allianz Kundler Team",
  subtitle = "",
  primary = { label: "Mehr erfahren", href: "#ansprechpartner" },
  secondary = { label: "Portfolio", href: "#impressionen" },
  backgroundImage,
  overlay = { from: "rgba(0,0,0,0.4)", to: "rgba(0,0,0,0.6)" },
}) {
  const bgSrc = safeImgSrc(backgroundImage?.url, FALLBACK_BG);

  return (
    <section className="py-10">
      <div className="relative overflow-hidden rounded-xl min-h-[420px] flex items-center justify-center p-8">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            alt={backgroundImage?.alt || "Team hero background"}
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
              backgroundImage: `linear-gradient(
                ${overlay?.from || "rgba(0,0,0,0.4)"},
                ${overlay?.to || "rgba(0,0,0,0.6)"}
              )`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-white text-4xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
            {title}
          </h1>

          <p className="text-white/90 text-lg lg:text-xl font-normal max-w-2xl mx-auto mt-3">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap mt-7">
            {/* PRIMARY – WHITE */}
            <a
              href={primary?.href || "#"}
              className="bg-white text-[#111717]
                         px-8 py-3 rounded-xl font-bold
                         hover:bg-white/90 hover:scale-105
                         transition-transform inline-flex items-center justify-center"
            >
              {primary?.label || ""}
            </a>

            {/* SECONDARY – GLASS */}
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
