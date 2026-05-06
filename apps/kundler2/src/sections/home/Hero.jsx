import { useEffect, useRef, useState } from "react";
import { HOME_IMAGES } from "../../data/homeImages";

function getImage(value, fallbackKey) {
  if (value) return value;
  return HOME_IMAGES[fallbackKey] || "";
}

function getImageFromKey(imageKey, fallbackKey) {
  return HOME_IMAGES[imageKey] || HOME_IMAGES[fallbackKey] || "";
}

function StatPill({ value, label }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div className="text-white font-extrabold text-sm">{value}</div>
      <div className="text-white/60 text-[11px] mt-1">{label}</div>
    </div>
  );
}

function TinyCard({ title, subtitle, img }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <div className="h-28 bg-black/40">
        <img src={img} alt="" className="w-full h-full object-cover opacity-90" />
      </div>

      <div className="p-3">
        <div className="text-white text-xs font-extrabold">{title}</div>
        <div className="text-white/60 text-[11px] mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

export default function Hero({
  badge = "Allianz Versicherung • Privatkunden",
  headline = "Die kalte Jahreszeit genießen – mit starker Absicherung an Ihrer Seite.",
  highlight = "mit starker Absicherung",
  subheading = "Empfehlungen, Services und persönliche Beratung – damit Sie im Alltag und in besonderen Momenten gut vorbereitet sind.",
  primaryLabel = "Ansprechpartner:in vor Ort finden",
  primaryHref = "/beratung",
  secondaryLabel = "Meine Allianz • Anmelden",
  secondaryHref = "/login",
  stats = [
    { value: "24/7", label: "Schaden melden" },
    { value: "Mo–Fr", label: "Beratung 8–20 Uhr" },
    { value: "Top", label: "Online-Antrag" },
  ],
  cards = [
    { title: "Kfz-Versicherung", subtitle: "Optimaler Schutz fürs Auto", imageKey: "heroCard1" },
    { title: "Zahnzusatz", subtitle: "Premium-Schutz ohne Wartezeit", imageKey: "heroCard2" },
  ],
  heroPoster,
  heroPosterKey = "heroPoster",
  heroVideos,
  highlightTitle = "Schnelle & unkomplizierte Schadensabwicklung",
  highlightStatus = "Aktiv",
  highlightMeta = "Deutschlandweit",
  highlightLinkLabel = "Mehr entdecken",
  highlightLinkHref = "/produkte",
}) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  const posterSrc = getImage(heroPoster, heroPosterKey);
  const videos =
    Array.isArray(heroVideos) && heroVideos.length
      ? heroVideos
      : HOME_IMAGES.heroVideos || [];

  const beforeHighlight = headline.includes(highlight)
    ? headline.split(highlight)[0]
    : headline;

  const afterHighlight = headline.includes(highlight)
    ? headline.split(highlight).slice(1).join(highlight)
    : "";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setReady(true);
    const onCanPlay = () => {
      v.play?.().catch(() => {});
    };

    v.addEventListener("playing", onPlay);
    v.addEventListener("canplay", onCanPlay);
    v.play?.().catch(() => {});

    return () => {
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={posterSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />

        {videos.length ? (
          <video
            ref={videoRef}
            className={[
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              ready ? "opacity-100" : "opacity-0",
            ].join(" ")}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {videos.map((src) => (
              <source key={src} src={src} type="video/mp4" />
            ))}
          </video>
        ) : null}

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-[10px] font-extrabold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {badge}
            </div>

            <h1 className="mt-5 text-white font-extrabold tracking-tight text-[38px] leading-[1.05] sm:text-5xl lg:text-6xl">
              {beforeHighlight}
              {highlight && headline.includes(highlight) ? (
                <span className="text-primary">{highlight}</span>
              ) : null}
              {afterHighlight}
            </h1>

            <p className="mt-5 text-white/70 text-sm sm:text-base max-w-xl">
              {subheading}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href={primaryHref}
                className="h-10 px-5 rounded-xl bg-primary text-text-dark font-extrabold text-xs inline-flex items-center justify-center hover:opacity-90 transition"
              >
                {primaryLabel}
              </a>

              <a
                href={secondaryHref}
                className="h-10 px-5 rounded-xl bg-white/10 border border-white/10 text-white font-extrabold text-xs inline-flex items-center justify-center hover:bg-white/15 transition"
              >
                {secondaryLabel}
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
              {(stats || []).map((item) => (
                <StatPill key={`${item.value}-${item.label}`} value={item.value} label={item.label} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {(cards || []).map((card) => (
                <TinyCard
                  key={`${card.title}-${card.subtitle}`}
                  img={card.img || getImageFromKey(card.imageKey, "heroCard1")}
                  title={card.title}
                  subtitle={card.subtitle}
                />
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-white/60 text-[10px] uppercase tracking-widest font-extrabold">
                    Unser Highlight
                  </div>

                  <div className="text-white font-extrabold mt-1">
                    {highlightTitle}
                  </div>
                </div>

                <div className="text-primary font-extrabold">{highlightStatus}</div>
              </div>

              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[78%] bg-primary" />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
                <span>{highlightMeta}</span>

                <a
                  href={highlightLinkHref}
                  className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white font-extrabold hover:bg-black/60 transition"
                >
                  {highlightLinkLabel}
                </a>
              </div>
            </div>

            <div className="absolute -z-10 -top-10 -right-10 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}