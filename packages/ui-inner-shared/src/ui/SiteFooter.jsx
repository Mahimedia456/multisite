/**
 * Props:
 * - brand: {
 *   name: string,
 *   logoType?: "emoji" | "material" | "icon",
 *   logoValue?: string,
 *   LogoIcon?: ReactComponent,
 *   description?: string,
 *   socials?: Array<{ label: string, href: string }>,
 *   columns?: Array<{ title: string, links: Array<{ label: string, href: string }> }>,
 *   bottomLeft?: string,
 *   bottomRight?: string
 * }
 */
export default function SiteFooter({ brand }) {
  const {
    name,
    logoType = "emoji",
    logoValue = "✨",
    LogoIcon,
    description = "",
    socials = [],
    columns = [],
    bottomLeft = "",
    bottomRight = "",
  } = brand || {};

  const renderSmallLogo = () => {
    if (LogoIcon) return <LogoIcon className="text-primary" />;
    if (logoType === "material") return <span className="material-symbols-outlined">pets</span>;
    return <span className="text-base">{logoValue}</span>;
  };

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand block */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {renderSmallLogo()}
              </div>
              <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                {name}
              </div>
            </div>

            {description ? (
              <p className="mt-4 text-xs text-gray-500 max-w-sm leading-relaxed">
                {description}
              </p>
            ) : null}

            {socials.length ? (
              <div className="mt-5 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-xs text-gray-600 dark:text-gray-200"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3 text-xs text-gray-500">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a className="hover:text-primary transition-colors" href={l.href}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-[10px] text-gray-400">{bottomLeft}</div>
          <div className="text-[10px] text-gray-400">{bottomRight}</div>
        </div>
      </div>
    </footer>
  );
}
