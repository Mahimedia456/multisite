import React, { useEffect, useMemo, useRef, useState } from "react";

const ADMIN_LOGIN_URL = "https://multisite-admin.vercel.app/login";

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
  if (isNonEmptyString(item.url)) return item.url;
  if (isNonEmptyString(item.path)) return item.path;
  return "#";
}

function cleanPath(v = "") {
  let s = String(v || "").trim();
  if (!s) return "";

  try {
    if (s.startsWith("http")) s = new URL(s).pathname;
  } catch {}

  s = s.split("?")[0].split("#")[0].trim();
  if (!s.startsWith("/")) s = `/${s}`;
  s = s.replace(/\/+$/, "");

  return s || "/";
}

function getVisibilityKey(item) {
  if (!item || typeof item !== "object") return "";

  const href = cleanPath(item.href || item.to || item.url || item.path || "");
  const label = String(item.label || item.title || "").toLowerCase().trim();

  if (href === "/") return "unique:home";

  if (
    href === "/about" ||
    label === "über uns" ||
    label === "ueber uns" ||
    label === "about" ||
    label === "about us"
  ) {
    return "unique:about";
  }

  if (href === "/contact" || href === "/kontakt" || label === "kontakt") {
    return "unique:contact";
  }

  if (
    href === "/knowledge" ||
    label.includes("wissen") ||
    label.includes("knowledge")
  ) {
    return "shared:knowledge";
  }

  if (href === "/kfz-versicherung" || label.includes("kfz")) {
    return "shared:kfz-versicherung";
  }

  if (href === "/e-auto-versicherung" || label.includes("e-auto")) {
    return "shared:e-auto-versicherung";
  }

  return "";
}

function filterMenuItems(items = [], hiddenWebsitePages = []) {
  const hiddenSet = new Set(hiddenWebsitePages || []);

  return (items || [])
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const key = getVisibilityKey(item);
      if (key && hiddenSet.has(key)) return null;

      const next = { ...item };

      if (next.mega?.columns && Array.isArray(next.mega.columns)) {
        next.mega = {
          ...next.mega,
          columns: next.mega.columns
            .map((col) => {
              const footerKey = getVisibilityKey(col?.footerLink);

              return {
                ...col,
                items: filterMenuItems(col?.items || [], hiddenWebsitePages),
                footerLink:
                  footerKey && hiddenSet.has(footerKey)
                    ? null
                    : col?.footerLink,
              };
            })
            .filter((col) => {
              return (col?.items || []).length > 0 || col?.footerLink?.label;
            }),
        };
      }

      return next;
    })
    .filter(Boolean);
}

function getBrandContact(brand = {}) {
  const email =
    brand.company_email ||
    brand.companyEmail ||
    brand.email ||
    brand.contactEmail ||
    brand.contact_email ||
    brand.supportEmail ||
    brand.support_email ||
    brand.mail ||
    brand.company?.email ||
    brand.contact?.email ||
    brand.support?.email ||
    "";

  const phone =
    brand.company_phone ||
    brand.companyPhone ||
    brand.phone ||
    brand.telephone ||
    brand.tel ||
    brand.contactPhone ||
    brand.contact_phone ||
    brand.supportPhone ||
    brand.support_phone ||
    brand.company?.phone ||
    brand.contact?.phone ||
    brand.support?.phone ||
    "";

  const whatsapp =
    brand.company_whatsapp ||
    brand.companyWhatsapp ||
    brand.whatsapp ||
    brand.company?.whatsapp ||
    brand.contact?.whatsapp ||
    brand.support?.whatsapp ||
    "";

  const location =
    brand.company_location ||
    brand.companyLocation ||
    brand.location ||
    brand.address ||
    brand.company?.location ||
    brand.company?.address ||
    brand.contact?.location ||
    brand.contact?.address ||
    "";

  return { email, phone, whatsapp, location };
}

function telHref(phone = "") {
  const cleaned = String(phone || "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "#";
}

function whatsappHref(whatsapp = "") {
  const cleaned = String(whatsapp || "").replace(/[^\d]/g, "");
  return cleaned ? `https://wa.me/${cleaned}` : "#";
}

export default function SiteHeader({
  brand,
  LinkComponent = DefaultLink,
  variant = "bar",
  showDefaultAbout = true,
  hiddenWebsitePages = [],

  /**
   * "topbar" = company details topbar + logo row buttons
   * "actions" = only logo row buttons, no topbar
   * "both" = same as topbar, kept for backward compatibility
   * "none" = no topbar and no logo row buttons
   */
  contactPlacement = "topbar",

  showTopBar = true,
}) {
  const Link = LinkComponent;

  const headerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMega, setOpenDesktopMega] = useState(null);
  const [mobileOpenMega, setMobileOpenMega] = useState({});

  const {
    name,
    logoType = "material",
    logoValue = "pets",
    logoUrl = "",
    LogoIcon,
    homeLinks = [],
    login = { label: "Log In", href: ADMIN_LOGIN_URL },
    cta = { label: "kontakt", to: "/contact" },
  } = brand || {};

  const { email, phone, whatsapp, location } = getBrandContact(brand);

  const normalizedLinks = useMemo(() => {
    return filterMenuItems(homeLinks || [], hiddenWebsitePages).map((l) => ({
      ...l,
      label: String(l?.label || "").trim(),
      href: l?.href,
      to: l?.to,
      url: l?.url,
      path: l?.path,
      mega: l?.mega || null,
    }));
  }, [homeLinks, hiddenWebsitePages]);

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

    if (logoType === "emoji") {
      return <span className="text-2xl leading-none">{logoValue}</span>;
    }

    return (
      <span className="material-symbols-outlined text-2xl leading-none">
        {logoValue}
      </span>
    );
  };

  const hasAboutAlready = normalizedLinks.some((l) => {
    const key = getVisibilityKey(l);
    const label = String(l?.label || "").trim().toLowerCase();
    const href = cleanPath(l?.href || l?.to || l?.url || l?.path || "");

    return (
      key === "unique:about" ||
      label === "about" ||
      label === "about us" ||
      label === "über uns" ||
      href === "/about"
    );
  });

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

  const loginHref = login?.href || login?.url || ADMIN_LOGIN_URL;

  const renderCta = () => {
    const label = cta?.label || "kontakt";
    const cls =
      "h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark " +
      "text-white text-sm font-extrabold shadow-lg shadow-primary/20 transition-all " +
      "inline-flex items-center justify-center leading-none whitespace-nowrap";

    if (cta?.to) {
      return (
        <Link to={cta.to} className={cls}>
          {label}
        </Link>
      );
    }

    if (cta?.href) {
      return (
        <a href={cta.href} className={cls}>
          {label}
        </a>
      );
    }

    return (
      <Link to="/contact" className={cls}>
        {label}
      </Link>
    );
  };

  const renderTopbarContactInfo = () => {
    return (
      <div className="flex min-w-0 items-center gap-5 xl:gap-7">
        {phone ? (
          <a
            href={telHref(phone)}
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">
              call
            </span>
            <span className="whitespace-nowrap">{phone}</span>
          </a>
        ) : null}

        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex min-w-0 items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">
              mail
            </span>
            <span className="truncate max-w-[260px]">{email}</span>
          </a>
        ) : null}

        {whatsapp ? (
          <a
            href={whatsappHref(whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">
              chat
            </span>
            <span className="whitespace-nowrap">{whatsapp}</span>
          </a>
        ) : null}

        {location ? (
          <span className="inline-flex min-w-0 items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[18px] shrink-0">
              location_on
            </span>
            <span className="truncate max-w-[360px]">{location}</span>
          </span>
        ) : null}
      </div>
    );
  };

  const renderHeaderRowActions = () => {
    return (
      <div className="hidden lg:flex items-center justify-end gap-3">
        <Link
          to="/knowledge"
          className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary transition-all inline-flex items-center gap-2 text-sm font-extrabold shadow-sm"
        >
          <span className="material-symbols-outlined text-[22px] text-primary">
            support_agent
          </span>
          <span>Support</span>
        </Link>

        <a
          href={loginHref}
          className="h-11 w-11 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 inline-flex items-center justify-center"
          aria-label="My account"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
        </a>

        {renderCta()}
      </div>
    );
  };

  const shouldShowTopbar =
    showTopBar && (contactPlacement === "topbar" || contactPlacement === "both");

  const shouldShowHeaderActions =
    contactPlacement === "topbar" ||
    contactPlacement === "actions" ||
    contactPlacement === "both";

  const toggleMobileMega = (label) => {
    setMobileOpenMega((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderTopBar = () => {
    if (!shouldShowTopbar) return null;

    return (
      <div className="hidden lg:block bg-primary text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-11 flex items-center justify-between gap-6 text-sm font-bold">
            {renderTopbarContactInfo()}
            <div className="shrink-0" />
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopMegaPanel = () => {
    if (!activeMegaItem || !hasMega(activeMegaItem)) return null;

    const columns = (activeMegaItem?.mega?.columns || []).filter(Boolean);
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
                          <Link
                            key={`${label}-${j}`}
                            to={it.to}
                            className={megaLink}
                          >
                            {label}
                          </Link>
                        );
                      }

                      return (
                        <a
                          key={`${label}-${j}`}
                          href={href}
                          className={megaLink}
                        >
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
      <div className="h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {renderLogo()}
          </div>

          <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap truncate">
            {name}
          </span>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {shouldShowHeaderActions ? renderHeaderRowActions() : null}

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
                      setOpenDesktopMega((v) =>
                        v === item.label ? null : item.label
                      );
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
                  <Link
                    key={`${item.label}-${idx}`}
                    className={navItem}
                    to={item.to}
                  >
                    {item.label || "Link"}
                  </Link>
                );
              }

              return (
                <a
                  key={`${item.label}-${idx}`}
                  className={navItem}
                  href={item?.href || item?.url || item?.path || "#"}
                >
                  {item?.label || "Link"}
                </a>
              );
            })}

            {showDefaultAbout && !hasAboutAlready ? (
              <Link className={navItem} to="/about">
                About Us
              </Link>
            ) : null}
          </div>
        </div>

        {renderDesktopMegaPanel()}
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <div className="flex flex-col py-2">
            {phone ? (
              <a
                href={telHref(phone)}
                className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="material-symbols-outlined text-primary text-[20px]">
                  call
                </span>
                {phone}
              </a>
            ) : null}

            {email ? (
              <a
                href={`mailto:${email}`}
                className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="material-symbols-outlined text-primary text-[20px]">
                  mail
                </span>
                {email}
              </a>
            ) : null}

            {whatsapp ? (
              <a
                href={whatsappHref(whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="material-symbols-outlined text-primary text-[20px]">
                  chat
                </span>
                {whatsapp}
              </a>
            ) : null}

            {location ? (
              <div className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  location_on
                </span>
                {location}
              </div>
            ) : null}

            <Link
              to="/knowledge"
              className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-primary text-[20px]">
                support_agent
              </span>
              Support
            </Link>

            <a
              href={loginHref}
              className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-primary text-[20px]">
                person
              </span>
              My account
            </a>

            <Link
              to="/contact"
              className="px-4 py-3 flex items-center gap-2 text-slate-700 text-sm font-bold border-b border-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-primary text-[20px]">
                contact_mail
              </span>
              kontakt
            </Link>

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
                          <div
                            key={`${col?.title || "col"}-${cIdx}`}
                            className="mt-3"
                          >
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

            {showDefaultAbout && !hasAboutAlready ? (
              <Link
                to="/about"
                className="px-4 py-2 block text-slate-700 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "boxed") {
    return (
      <div className="sticky top-3 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderTopBar()}
          <nav className="backdrop-blur-md border bg-white/90 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8">{Inner}</div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 w-full">
      {renderTopBar()}
      <nav className="w-full backdrop-blur-md border-b bg-white/90 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{Inner}</div>
      </nav>
    </div>
  );
}