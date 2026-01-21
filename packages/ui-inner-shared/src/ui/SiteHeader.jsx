/**
 * Router-agnostic SiteHeader (NO react-router-dom import)
 * UI remains identical. The consuming app passes LinkComponent (React Router's Link).
 *
 * Fixes:
 * ✅ CTA button baseline/vertical align (Get a Quote upar nahi jayega)
 * ✅ Duplicate "About" / "About Us" avoid (agar homeLinks me already about hai)
 * ✅ Supports logoType: emoji | material | image | icon
 *
 * Props:
 * - brand: {
 *    name: string,
 *    logoType?: "emoji" | "material" | "icon" | "image",
 *    logoValue?: string,        // emoji or material icon name
 *    logoUrl?: string,          // for image type
 *    LogoIcon?: ReactComponent, // optional custom component (e.g. Icon)
 *    homeLinks?: Array<{ label: string, href?: string, to?: string }>,
 *    cta?: { label: string, onClick?: () => void, to?: string, href?: string },
 *    login?: { label?: string, to?: string },
 *  }
 * - LinkComponent?: React component like react-router-dom's Link
 */

const DefaultLink = ({ to, href, children, ...rest }) => {
  const finalHref = href ?? to ?? "#";
  return (
    <a href={finalHref} {...rest}>
      {children}
    </a>
  );
};

export default function SiteHeader({ brand, LinkComponent = DefaultLink }) {
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

    // material icon (default)
    return <span className="material-symbols-outlined text-2xl leading-none">{logoValue}</span>;
  };

  const baseNavClass =
    "text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary transition-colors";

  const renderNavItem = (item, idx) => {
    const key = `${item?.label || "link"}-${idx}`;

    if (item?.to) {
      return (
        <Link key={key} className={baseNavClass} to={item.to}>
          {item.label}
        </Link>
      );
    }

    return (
      <a key={key} className={baseNavClass} href={item?.href || "#"}>
        {item?.label || "Link"}
      </a>
    );
  };

  // ✅ prevent 2x About: if homeLinks already contains About(/about)
  const hasAboutAlready = (homeLinks || []).some((l) => {
    const label = String(l?.label || "").trim().toLowerCase();
    const href = String(l?.href || l?.to || "").trim().toLowerCase();
    return label === "about" || label === "about us" || href === "/about" || href.startsWith("/about");
  });

  const renderCta = () => {
    // ✅ inline-flex + items-center fixes "button upar"
    const cls =
      "h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:opacity-90 " +
      "text-white dark:text-primary text-sm font-bold shadow-lg shadow-primary/20 transition-all " +
      "inline-flex items-center justify-center leading-none";

    if (cta?.to) return <Link to={cta.to} className={cls}>{cta.label}</Link>;
    if (cta?.href) return <a href={cta.href} className={cls}>{cta.label}</a>;
    return (
      <button type="button" className={cls} onClick={cta?.onClick}>
        {cta?.label}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {renderLogo()}
            </div>
            <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">
              {name}
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {(homeLinks || []).map(renderNavItem)}

            {/* Shared route link (only if not already present) */}
            {!hasAboutAlready ? (
              <Link className={baseNavClass} to="/about">
                About Us
              </Link>
            ) : null}
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {login?.to ? (
              <Link
                className="hidden sm:block text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                to={login.to}
              >
                {login.label ?? "Log In"}
              </Link>
            ) : null}

            {renderCta()}
          </div>
        </div>
      </div>
    </nav>
  );
}
