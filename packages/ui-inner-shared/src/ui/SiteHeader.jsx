// SiteHeader.jsx (shared)
const DefaultLink = ({ to, href, children, ...rest }) => {
  const finalHref = href ?? to ?? "#";
  return (
    <a href={finalHref} {...rest}>
      {children}
    </a>
  );
};

export default function SiteHeader({
  brand,
  LinkComponent = DefaultLink,
  variant = "bar", // ✅ NEW: "bar" | "boxed"
}) {
  const Link = LinkComponent;

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

  const renderLogo = () => {
    if (LogoIcon) return <LogoIcon className="text-3xl" />;
    if (logoType === "image" && logoUrl) {
      return <img src={logoUrl} alt={name || "logo"} className="w-6 h-6 object-contain" />;
    }
    if (logoType === "emoji") return <span className="text-2xl leading-none">{logoValue}</span>;
    return <span className="material-symbols-outlined text-2xl leading-none">{logoValue}</span>;
  };

const baseNavClass =
  "text-sm font-medium text-slate-800 hover:text-primary transition-colors";


  const hasAboutAlready = (homeLinks || []).some((l) => {
    const label = String(l?.label || "").trim().toLowerCase();
    const href = String(l?.href || l?.to || "").trim().toLowerCase();
    return label === "about" || label === "about us" || href === "/about" || href.startsWith("/about");
  });

  const renderNavItem = (item, idx) => {
    const key = `${item?.label || "link"}-${idx}`;
    if (item?.to) return <Link key={key} className={baseNavClass} to={item.to}>{item.label}</Link>;
    return <a key={key} className={baseNavClass} href={item?.href || "#"}>{item?.label || "Link"}</a>;
  };

  const renderCta = () => {
    // ✅ button theme color by CSS vars (bg-primary)
    const cls =
      "h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark " +
      "text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all " +
      "inline-flex items-center justify-center leading-none";

    if (cta?.to) return <Link to={cta.to} className={cls}>{cta.label}</Link>;
    if (cta?.href) return <a href={cta.href} className={cls}>{cta.label}</a>;
    return <button type="button" className={cls} onClick={cta?.onClick}>{cta?.label}</button>;
  };

  const Inner = (
    <div className="h-20 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {renderLogo()}
        </div>
<span className="text-base font-extrabold tracking-tight text-slate-900">
          {name}
        </span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-10">
        {(homeLinks || []).map(renderNavItem)}
        {!hasAboutAlready ? (
          <Link className={baseNavClass} to="/about">About Us</Link>
        ) : null}
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {login?.to ? (
          <Link
            className="hidden sm:block text-sm font-semibold text-slate-800 hover:text-primary transition-colors"
            to={login.to}
          >
            {login.label ?? "Log In"}
          </Link>
        ) : null}
        {renderCta()}
      </div>
    </div>
  );

  // ✅ Variant Switch
  if (variant === "boxed") {
    return (
      <div className="sticky top-3 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className=" backdrop-blur-md border bg-white/90 border-gray-100 rounded-2xl shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">{Inner}</div>
          </nav>
        </div>
      </div>
    );
  }

  // default "bar"
  return (
    <nav className="sticky top-0 z-50 w-full  backdrop-blur-md border-b bg-white/90 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{Inner}</div>
    </nav>
  );
}
