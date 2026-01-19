export default function StickyHeader({ tenant }) {
  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            {tenant.logoMark}
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            {tenant.brandName}
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {tenant.headerLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium opacity-70 hover:opacity-100 transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={tenant.loginUrl}
            className="bg-primary/10 text-primary px-5 py-2 rounded-xl text-sm font-bold"
          >
            Login
          </a>
          <a
            href={tenant.ctaUrl}
            className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold shadow"
          >
            {tenant.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
