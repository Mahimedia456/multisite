import React, { useEffect, useMemo, useRef, useState } from "react";

const DefaultLink = ({ to, href, children, ...rest }) => {
  const finalHref = href ?? to ?? "#";
  return (
    <a href={finalHref} {...rest}>
      {children}
    </a>
  );
};

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizeHref(item) {
  if (!item) return "#";
  if (isNonEmptyString(item.href)) return item.href;
  if (isNonEmptyString(item.to)) return item.to;
  return "#";
}

export default function SiteHeader({
  brand,
  LinkComponent = DefaultLink,
  variant = "bar", // "bar" | "boxed"
}) {
  const Link = LinkComponent;

  const headerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMega, setOpenDesktopMega] = useState(null); // label string or null
  const [mobileOpenMega, setMobileOpenMega] = useState({}); // { [label]: boolean }

  const {
    name,
    logoType = "material",
    logoValue = "pets",
    logoUrl = "",
    LogoIcon,
    homeLinks = [],
    login = { label: "Log In", to: "/login" },
    cta = { label: "Get a Quote" },
  } = brand || {};

  const normalizedLinks = useMemo(() => {
    return (homeLinks || []).map((l) => ({
      ...l,
      label: String(l?.label || "").trim(),
      href: l?.href,
      to: l?.to,
      mega: l?.mega || null,
    }));
  }, [homeLinks]);

  const activeMegaItem = useMemo(() => {
    if (!openDesktopMega) return null;
    return normalizedLinks.find((x) => x.label === openDesktopMega) || null;
  }, [openDesktopMega, normalizedLinks]);

  function hasMega(item) {
    const mega = item?.mega;
    return !!(mega && Array.isArray(mega.columns) && mega.columns.length);
  }

  const renderLogo = () => {
    if (LogoIcon) return <LogoIcon className="text-3xl" />;
    if (logoType === "image" && logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={name || "logo"}
          className="w-6 h-6 object-contain"
        />
      );
    }
    if (logoType === "emoji")
      return <span className="text-2xl leading-none">{logoValue}</span>;
    return (
      <span className="material-symbols-outlined text-2xl leading-none">
        {logoValue}
      </span>
    );
  };

  const hasAboutAlready = (homeLinks || []).some((l) => {
    const label = String(l?.label || "").trim().toLowerCase();
    const href = String(l?.href || l?.to || "").trim().toLowerCase();
    return (
      label === "about" ||
      label === "about us" ||
      label === "über uns" ||
      href === "/about" ||
      href.startsWith("/about")
    );
  });

  // ✅ close helpers (prevents flicker when moving mouse down)
  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (ms = 150) => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenDesktopMega(null);
      closeTimerRef.current = null;
    }, ms);
  };

  // close on outside click / ESC
  useEffect(() => {
    function onDocDown(e) {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) {
        setOpenDesktopMega(null);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") {
        setOpenDesktopMega(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // if mobile opens, close desktop mega
  useEffect(() => {
    if (mobileOpen) setOpenDesktopMega(null);
  }, [mobileOpen]);

  useEffect(() => {
    return () => cancelClose();
  }, []);

  const navItem =
    "leading-none font-medium text-slate-800 hover:text-primary transition-colors " +
    "whitespace-nowrap text-[clamp(11px,0.9vw,14px)] px-2 xl:px-3 py-3";

  const navItemButton =
    "leading-none font-medium text-slate-800 hover:text-primary transition-colors " +
    "whitespace-nowrap text-[clamp(11px,0.9vw,14px)] px-2 xl:px-3 py-3 " +
    "inline-flex items-center gap-1.5";

  const megaPanelBase =
    "absolute left-0 right-0 top-full z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-xl";

  const megaInnerWrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

  const megaCard =
    "rounded-2xl border border-[#f0edf7] bg-white/90 shadow-sm p-5";

  const megaColTitle =
    "text-[13px] font-extrabold text-slate-900 tracking-tight";

  const megaLink =
    "block text-sm text-slate-700 hover:text-primary transition-colors py-1";

  const caretIcon = (open) => (
    <span className="material-symbols-outlined text-[18px] leading-none">
      {open ? "expand_less" : "expand_more"}
    </span>
  );

  const renderCta = () => {
    const cls =
      "h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark " +
      "text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all " +
      "inline-flex items-center justify-center leading-none whitespace-nowrap";

    if (cta?.to) return <Link to={cta.to} className={cls}>{cta.label}</Link>;
    if (cta?.href) return <a href={cta.href} className={cls}>{cta.label}</a>;
    return (
      <button type="button" className={cls} onClick={cta?.onClick}>
        {cta?.label}
      </button>
    );
  };

  // Mobile accordion mega
  const toggleMobileMega = (label) => {
    setMobileOpenMega((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderDesktopMegaPanel = () => {
    if (!activeMegaItem || !hasMega(activeMegaItem)) return null;

    const columns = (activeMegaItem?.mega?.columns || []).filter(Boolean);

    // ✅ IMPORTANT: dynamic grid based on column count (no empty 4th)
    // 1-2 -> 2 cols, 3 -> 3 cols, 4+ -> 4 cols
    const count = columns.length;
    const gridCols =
      count <= 2
        ? "md:grid-cols-2"
        : count === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-4";

    return (
      <div
        className={megaPanelBase}
        onMouseEnter={cancelClose}
        onMouseLeave={() => scheduleClose(150)}
      >
        <div className={megaInnerWrap}>
          <div className="py-6 max-h-[70vh] overflow-y-auto">
            <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
              {columns.map((col, i) => (
                <div key={`${col?.title || "col"}-${i}`} className={megaCard}>
                  <div className={megaColTitle}>{col?.title || ""}</div>

                  <div className="mt-3 space-y-0.5">
                    {(col?.items || []).map((it, j) => {
                      const href = normalizeHref(it);
                      const label = it?.label || "Link";
                      if (isNonEmptyString(it?.to)) {
                        return (
                          <Link key={`${label}-${j}`} to={it.to} className={megaLink}>
                            {label}
                          </Link>
                        );
                      }
                      return (
                        <a key={`${label}-${j}`} href={href} className={megaLink}>
                          {label}
                        </a>
                      );
                    })}
                  </div>

                  {col?.footerLink?.label ? (
                    <div className="mt-3 pt-3 border-t border-[#f0edf7]">
                      {isNonEmptyString(col.footerLink?.to) ? (
                        <Link
                          to={col.footerLink.to}
                          className="text-sm font-bold text-primary"
                        >
                          {col.footerLink.label}
                        </Link>
                      ) : (
                        <a
                          href={normalizeHref(col.footerLink)}
                          className="text-sm font-bold text-primary"
                        >
                          {col.footerLink.label}
                        </a>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Inner = (
    <div className="w-full" ref={headerRef}>
      {/* Row 1 */}
      <div className="h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {renderLogo()}
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
            {name}
          </span>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {login?.to ? (
            <Link
              className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-primary transition-colors whitespace-nowrap"
              to={login.to}
            >
              {login.label ?? "Log In"}
            </Link>
          ) : null}

          {renderCta()}

          <button
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Row 2 Desktop Nav */}
      <div className="border-t border-gray-100 hidden sm:block relative">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center flex-nowrap min-w-0">
            {normalizedLinks.map((item, idx) => {
              if (hasMega(item)) {
                const isOpen = openDesktopMega === item.label;

                return (
                  <button
                    key={`${item.label}-${idx}`}
                    type="button"
                    className={navItemButton}
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenDesktopMega(item.label);
                    }}
                    onMouseLeave={() => scheduleClose(150)}
                    onFocus={() => {
                      cancelClose();
                      setOpenDesktopMega(item.label);
                    }}
                    onClick={() => {
                      cancelClose();
                      setOpenDesktopMega((v) => (v === item.label ? null : item.label));
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                  >
                    {item.label || "Menu"}
                    <span className="material-symbols-outlined text-[18px] leading-none">
                      expand_more
                    </span>
                  </button>
                );
              }

              if (item?.to) {
                return (
                  <Link key={`${item.label}-${idx}`} className={navItem} to={item.to}>
                    {item.label || "Link"}
                  </Link>
                );
              }

              return (
                <a
                  key={`${item.label}-${idx}`}
                  className={navItem}
                  href={item?.href || "#"}
                >
                  {item?.label || "Link"}
                </a>
              );
            })}

            {!hasAboutAlready ? (
              <Link className={navItem} to="/about">
                About Us
              </Link>
            ) : null}
          </div>
        </div>

        {/* ✅ SINGLE GLOBAL MEGA PANEL */}
        {renderDesktopMegaPanel()}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <div className="flex flex-col py-2">
            {normalizedLinks.map((item, idx) => {
              const label = item?.label || `Link-${idx}`;

              if (hasMega(item)) {
                const opened = !!mobileOpenMega[label];
                return (
                  <div key={`${label}-${idx}`} className="px-4">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between py-3 text-slate-800 text-sm font-extrabold"
                      onClick={() => toggleMobileMega(label)}
                      aria-expanded={opened}
                    >
                      <span>{label}</span>
                      {caretIcon(opened)}
                    </button>

                    {opened ? (
                      <div className="pb-3">
                        {(item?.mega?.columns || []).map((col, cIdx) => (
                          <div key={`${col?.title || "col"}-${cIdx}`} className="mt-3">
                            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                              {col?.title || ""}
                            </div>

                            <div className="mt-2 space-y-1">
                              {(col?.items || []).map((it, j) => {
                                const href = normalizeHref(it);
                                const l = it?.label || "Link";
                                if (isNonEmptyString(it?.to)) {
                                  return (
                                    <Link
                                      key={`${l}-${j}`}
                                      to={it.to}
                                      className="block text-sm text-slate-700 py-1"
                                      onClick={() => {
                                        setMobileOpen(false);
                                        setMobileOpenMega({});
                                      }}
                                    >
                                      {l}
                                    </Link>
                                  );
                                }
                                return (
                                  <a
                                    key={`${l}-${j}`}
                                    href={href}
                                    className="block text-sm text-slate-700 py-1"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileOpenMega({});
                                    }}
                                  >
                                    {l}
                                  </a>
                                );
                              })}
                            </div>

                            {col?.footerLink?.label ? (
                              <div className="mt-2">
                                {isNonEmptyString(col.footerLink?.to) ? (
                                  <Link
                                    to={col.footerLink.to}
                                    className="text-sm font-bold text-primary"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileOpenMega({});
                                    }}
                                  >
                                    {col.footerLink.label}
                                  </Link>
                                ) : (
                                  <a
                                    href={normalizeHref(col.footerLink)}
                                    className="text-sm font-bold text-primary"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileOpenMega({});
                                    }}
                                  >
                                    {col.footerLink.label}
                                  </a>
                                )}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="border-b border-gray-100" />
                  </div>
                );
              }

              const href = normalizeHref(item);
              return (
                <div key={`${label}-${idx}`} className="px-4 py-2">
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="block text-slate-700 text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="block text-slate-700 text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </a>
                  )}
                </div>
              );
            })}

            {!hasAboutAlready && (
              <Link
                to="/about"
                className="px-4 py-2 block text-slate-700 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "boxed") {
    return (
      <div className="sticky top-3 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="backdrop-blur-md border bg-white/90 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8">{Inner}</div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b bg-white/90 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{Inner}</div>
    </nav>
  );
}
