/**
 * Props:
 * - brand: {
 *   name: string,
 *   logoType?: "emoji" | "material" | "icon" | "text" | "image",
 *   logoValue?: string,
 *   logoUrl?: string,
 *   LogoIcon?: ReactComponent,
 *   description?: string,
 *   socials?: Array<{ label: string, href: string }>,
 *   columns?: Array<{
 *     title: string,
 *     links?: Array<{ label: string, href: string }>,
 *     description?: string,
 *     cta?: { label: string, href: string },
 *     rating?: { value: string, count: string }
 *   }>,
 *   bottomLeft?: string,
 *   bottomCenter?: string,
 *   bottomRight?: string
 * }
 */
export default function SiteFooter({ brand }) {
  const {
    name,
    logoType = "emoji",
    logoValue = "✨",
    logoUrl,
    LogoIcon,
    description = "",
    socials = [],
    columns = [],
    bottomLeft = "",
    bottomCenter = "",
    bottomRight = "",
  } = brand || {};

  const renderSmallLogo = () => {
    if (LogoIcon) return <LogoIcon className="text-white" />;

    if (logoType === "image" && logoUrl) {
      return <img src={logoUrl} alt={name || "logo"} className="w-5 h-5 object-contain" />;
    }

    if (logoType === "material") {
      return <span className="material-symbols-outlined text-white">{logoValue || "pets"}</span>;
    }

    if (logoType === "text") {
      return (
        <span className="text-[11px] font-extrabold tracking-wide text-white">
          {logoValue || name || "Brand"}
        </span>
      );
    }

    return <span className="text-base text-white">{logoValue}</span>;
  };

  function norm(s) {
    return String(s || "").trim().toLowerCase();
  }

  function SocialIcon({ label }) {
    const t = norm(label);

    const common = "w-4 h-4";
    if (t.includes("facebook") || t === "fb" || t === "f") {
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6H16.7V4.8c-.3 0-1.5-.1-2.8-.1-2.8 0-4.6 1.7-4.6 4.7V11H6.6v3h2.7v8h4.2z" />
        </svg>
      );
    }

    if (t.includes("instagram") || t === "ig" || t.includes("insta")) {
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.3A3.7 3.7 0 1 1 8.3 12 3.7 3.7 0 0 1 12 8.3zm0 2A1.7 1.7 0 1 0 13.7 12 1.7 1.7 0 0 0 12 10.3zM17.8 6.8a.7.7 0 1 1-.7-.7.7.7 0 0 1 .7.7z" />
        </svg>
      );
    }

    if (t.includes("linkedin") || t === "in") {
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.8a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM4.5 21.5h3.6V9H4.5v12.5zM9.9 9h3.5v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6v6.8h-3.6v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6.1H9.9V9z" />
        </svg>
      );
    }

    if (t.includes("xing")) {
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8.6 7.2c.2 0 .4.1.5.3.1.2.1.4 0 .6L7.4 11l2 3.5c.1.2.1.4 0 .6-.1.2-.3.3-.5.3H6.3c-.2 0-.4-.1-.5-.3L3.6 11l2.4-3.8c.1-.2.3-.3.5-.3h2.1zm9.9-3.1c.2 0 .4.1.5.3.1.2.1.4 0 .6l-4.3 7.6 2.8 5.1c.1.2.1.4 0 .6-.1.2-.3.3-.5.3h-2.1c-.2 0-.4-.1-.5-.3l-2.7-5.1 4.2-7.6c.1-.2.3-.3.5-.3h2.1z" />
        </svg>
      );
    }

    return <span className="text-[10px] font-extrabold">{String(label || "").slice(0, 2).toUpperCase()}</span>;
  }

  // ✅ pick 4 columns only in this order (by title)
  const byTitle = (t) => columns.find((c) => norm(c?.title) === norm(t)) || null;

  const colAllianz = byTitle("allianz");
  const colMeine = byTitle("meine allianz");
  const colService = byTitle("service");
  const colKarriere = byTitle("karriere");

  const fixedCols = [colAllianz, colMeine, colService, colKarriere].filter(Boolean);

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* ✅ 2 blocks: left brand, right 4 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand block (logo + socials KEEP SAME) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white overflow-hidden">
                {renderSmallLogo()}
              </div>
              <div className="font-extrabold text-sm text-white">{name}</div>
            </div>

            {description ? (
              <p className="mt-4 text-xs text-white/70 max-w-sm leading-relaxed">{description}</p>
            ) : null}

            {socials?.length ? (
              <div className="mt-5 flex gap-3 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={`${s.label}-${s.href}`}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                    href={s.href || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon label={s.label} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* ✅ Menus: 4 columns in one row */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {fixedCols.map((col, idx) => {
                const links = Array.isArray(col.links) ? col.links : [];
                return (
                  <div key={`${col.title || "col"}-${idx}`}>
                    <h4 className="text-xs font-extrabold text-white mb-4 uppercase tracking-widest">
                      {col.title}
                    </h4>

                    {links.length ? (
                      <ul className="space-y-3 text-xs text-white/70">
                        {links.map((l) => (
                          <li key={`${l.label}-${l.href}`}>
                            <a className="hover:text-white transition-colors" href={l.href || "#"}>
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-[10px] text-white/50">{bottomLeft}</div>
          {bottomCenter ? <div className="text-[10px] text-white/50">{bottomCenter}</div> : null}
          <div className="text-[10px] text-white/50">{bottomRight}</div>
        </div>
      </div>
    </footer>
  );
}
