import { useEffect, useState } from "react";

const LOGO_URL =
  "https://cdn.prod.website-files.com/68b990e52313551822599693/68c18d62352ef502fd9133af_758ad8866481896513a00206a964477c_Logo-Redesign-Blue.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Skip navigation */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-extrabold focus:text-black"
      >
        Skip navigation
      </a>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={[
            "mt-4 rounded-2xl px-4 py-3 backdrop-blur-md transition",
            scrolled
              ? "bg-black/70 ring-1 ring-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
              : "bg-black/45 ring-1 ring-white/10",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            {/* LOGO (white via filter) */}
            <a href="#content" className="flex items-center">
              <img
                src={LOGO_URL}
                alt="Frankfurt Intern e.V."
                className="h-9 w-auto object-contain filter brightness-0 invert"
              />
            </a>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-7 md:flex">
              <a
                href="#ueber"
                className="text-xs font-semibold text-white/80 hover:text-white"
              >
                Über uns
              </a>
              <a
                href="#team"
                className="text-xs font-semibold text-white/80 hover:text-white"
              >
                Team
              </a>
              <a
                href="#mitgliedschaft"
                className="text-xs font-semibold text-white/80 hover:text-white"
              >
                Mitgliedschaft
              </a>
              <a
                href="#kontakt"
                className="text-xs font-semibold text-white/80 hover:text-white"
              >
                Kontakt
              </a>
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 md:flex">
              <button className="rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold text-white ring-1 ring-white/15 hover:bg-white/15">
                Login
              </button>
             a
              <a
                href="#kontakt"
                className="rounded-full bg-orange-500 px-4 py-2 text-xs font-extrabold text-black hover:bg-orange-400"
              >
                Kontakt
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15 md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-white transition ${
                    open ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition ${
                    open ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              open ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-2xl bg-black/65 ring-1 ring-white/10 p-3">
              {[
                ["#ueber", "Über uns"],
                ["#team", "Team"],
                ["#mitgliedschaft", "Mitgliedschaft"],
                ["#kontakt", "Kontakt"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
                >
                  {label}
                </a>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="h-11 rounded-xl bg-white/10 text-xs font-extrabold text-white ring-1 ring-white/15 hover:bg-white/15">
                  Login
                </button>
                <a
                  href="#kontakt"
                  onClick={() => setOpen(false)}
                  className="grid h-11 place-items-center rounded-xl bg-orange-500 text-xs font-extrabold text-black hover:bg-orange-400"
                >
                  Kontakt
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
