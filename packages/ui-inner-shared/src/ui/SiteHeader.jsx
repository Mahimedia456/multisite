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
  contactPlacement = "topbar",
  showTopBar = true,
}) {
  const Link = LinkComponent;

  const headerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMega, setOpenDesktopMega] = useState(null);
  const [mobileSubmenuItem, setMobileSubmenuItem] = useState(null);

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
        setMobileSubmenuItem(null);
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
    if (mobileOpen) {
      setOpenDesktopMega(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileSubmenuItem(null);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    return () => cancelClose();
  }, []);

  const navItem =
    "leading-none font-medium text-slate-800 hover:text-primary transition-colors whitespace-nowrap text-[clamp(11px,0.9vw,14px)] px-2 xl:px-3 py-3";

  const navItemButton =
    "leading-none font-medium text-slate-800 hover:text-primary transition-colors whitespace-nowrap text-[clamp(11px,0.9vw,14px)] px-2 xl:px-3 py-3 inline-flex items-center gap-1.5";

  const megaPanelBase =
    "absolute left-0 right-0 top-full z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-xl";

  const megaInnerWrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  const megaCard = "rounded-2xl border border-[#f0edf7] bg-white/90 shadow-sm p-5";
  const megaColTitle = "text-[13px] font-extrabold text-slate-900 tracking-tight";
  const megaLink = "block text-sm text-slate-700 hover:text-primary transition-colors py-1";

  const loginHref = login?.href || login?.url || ADMIN_LOGIN_URL;

  const renderCta = () => {
    const label = cta?.label || "kontakt";
    const cls =
      "h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-extrabold shadow-lg shadow-primary/20 transition-all inline-flex items-center justify-center leading-none whitespace-nowrap";

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

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSubmenuItem(null);
  };

  const mobileContactRows = [
    phone
      ? {
          key: "phone",
          icon: "call",
          label: phone,
          href: telHref(phone),
        }
      : null,
    email
      ? {
          key: "email",
          icon: "mail",
          label: email,
          href: `mailto:${email}`,
        }
      : null,
    whatsapp
      ? {
          key: "whatsapp",
          icon: "chat",
          label: whatsapp,
          href: whatsappHref(whatsapp),
          external: true,
        }
      : null,
    location
      ? {
          key: "location",
          icon: "location_on",
          label: location,
          href: null,
        }
      : null,
  ].filter(Boolean);

  const renderMobileMainMenu = () => {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <Link to="/" onClick={closeMobile} className="flex min-w-0 items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {renderLogo()}
            </div>
            <span className="truncate text-lg font-extrabold text-slate-900">
              {name}
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 inline-flex items-center justify-center"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {mobileContactRows.length ? (
            <div className="mb-5 rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
              {mobileContactRows.map((row) => {
                const content = (
                  <>
                    <span className="material-symbols-outlined text-primary text-[24px] shrink-0">
                      {row.icon}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] font-extrabold text-slate-700">
                      {row.label}
                    </span>
                  </>
                );

                if (!row.href) {
                  return (
                    <div
                      key={row.key}
                      className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0"
                    >
                      {content}
                    </div>
                  );
                }

                return (
                  <a
                    key={row.key}
                    href={row.href}
                    target={row.external ? "_blank" : undefined}
                    rel={row.external ? "noreferrer" : undefined}
                    className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0 active:bg-white"
                    onClick={closeMobile}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          ) : null}

          <div className="mb-5 grid grid-cols-2 gap-3">
            <a
              href={loginHref}
              className="h-12 rounded-xl bg-primary text-white inline-flex items-center justify-center gap-2 text-sm font-extrabold"
              onClick={closeMobile}
            >
              <span className="material-symbols-outlined text-[21px]">person</span>
              My account
            </a>

            <Link
              to="/contact"
              className="h-12 rounded-xl border border-gray-200 bg-white text-slate-800 inline-flex items-center justify-center gap-2 text-sm font-extrabold"
              onClick={closeMobile}
            >
              <span className="material-symbols-outlined text-primary text-[21px]">
                contact_mail
              </span>
              kontakt
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            {normalizedLinks.map((item, idx) => {
              const label = item?.label || `Menu ${idx + 1}`;

              if (hasMega(item)) {
                return (
                  <button
                    key={`${label}-${idx}`}
                    type="button"
                    onClick={() => setMobileSubmenuItem(item)}
                    className="w-full flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 text-left last:border-b-0"
                  >
                    <span className="text-[15px] font-extrabold text-slate-900">
                      {label}
                    </span>
                    <span className="material-symbols-outlined text-slate-500">
                      chevron_right
                    </span>
                  </button>
                );
              }

              const href = normalizeHref(item);

              if (item.to) {
                return (
                  <Link
                    key={`${label}-${idx}`}
                    to={item.to}
                    className="block border-b border-gray-100 px-4 py-4 text-[15px] font-extrabold text-slate-900 last:border-b-0"
                    onClick={closeMobile}
                  >
                    {label}
                  </Link>
                );
              }

              return (
                <a
                  key={`${label}-${idx}`}
                  href={href}
                  className="block border-b border-gray-100 px-4 py-4 text-[15px] font-extrabold text-slate-900 last:border-b-0"
                  onClick={closeMobile}
                >
                  {label}
                </a>
              );
            })}

            {showDefaultAbout && !hasAboutAlready ? (
              <Link
                to="/about"
                className="block border-b border-gray-100 px-4 py-4 text-[15px] font-extrabold text-slate-900 last:border-b-0"
                onClick={closeMobile}
              >
                About Us
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const renderMobileSubmenu = () => {
    if (!mobileSubmenuItem) return null;

    const columns = mobileSubmenuItem?.mega?.columns || [];

    return (
      <div className="absolute inset-0 z-10 flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={() => setMobileSubmenuItem(null)}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
            Back
          </button>

          <button
            type="button"
            onClick={closeMobile}
            className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 inline-flex items-center justify-center"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <div className="border-b border-gray-100 px-5 py-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Menu
          </div>
          <div className="mt-1 text-2xl font-extrabold text-slate-950">
            {mobileSubmenuItem.label}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            {columns.map((col, cIdx) => (
              <div
                key={`${col?.title || "col"}-${cIdx}`}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                  {col?.title || ""}
                </div>

                <div className="mt-3 rounded-xl bg-white border border-gray-100 overflow-hidden">
                  {(col?.items || []).map((it, j) => {
                    const href = normalizeHref(it);
                    const l = it?.label || "Link";

                    if (isNonEmptyString(it?.to)) {
                      return (
                        <Link
                          key={`${l}-${j}`}
                          to={it.to}
                          className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm font-bold text-slate-800 last:border-b-0"
                          onClick={closeMobile}
                        >
                          <span>{l}</span>
                          <span className="material-symbols-outlined text-[18px] text-slate-400">
                            chevron_right
                          </span>
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={`${l}-${j}`}
                        href={href}
                        className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm font-bold text-slate-800 last:border-b-0"
                        onClick={closeMobile}
                      >
                        <span>{l}</span>
                        <span className="material-symbols-outlined text-[18px] text-slate-400">
                          chevron_right
                        </span>
                      </a>
                    );
                  })}
                </div>

                {col?.footerLink?.label ? (
                  <div className="mt-3">
                    {isNonEmptyString(col.footerLink?.to) ? (
                      <Link
                        to={col.footerLink.to}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary"
                        onClick={closeMobile}
                      >
                        {col.footerLink.label}
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </Link>
                    ) : (
                      <a
                        href={normalizeHref(col.footerLink)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary"
                        onClick={closeMobile}
                      >
                        {col.footerLink.label}
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMobileDrawer = () => {
    if (!mobileOpen) return null;

    return (
      <div className="sm:hidden fixed inset-0 z-[999] bg-white">
        <div className="relative h-full w-full overflow-hidden">
          {renderMobileMainMenu()}
          {renderMobileSubmenu()}
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
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
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

      {renderMobileDrawer()}
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