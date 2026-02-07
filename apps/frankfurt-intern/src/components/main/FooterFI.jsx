export default function FooterFI() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              {/* LOGO */}
              <img
                src="https://cdn.prod.website-files.com/68b990e52313551822599693/68c18d62352ef502fd9133af_758ad8866481896513a00206a964477c_Logo-Redesign-Blue.svg"
                alt="Frankfurt Intern e.V."
                className="h-9 w-auto invert"
              />

              <div className="text-sm font-extrabold tracking-widest">
               
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Netzwerk der erfolgreichsten Allianz-Agenturen Deutschlands.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <div className="text-xs font-extrabold tracking-widest text-white/80">
              LINKS
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              <li>
                <a className="hover:text-white" href="#ueber">
                  Über uns
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#mitgliedschaft">
                  Mitgliedschaft
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#team">
                  Partnernetzwerk
                </a>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <div className="text-xs font-extrabold tracking-widest text-white/80">
              RECHTLICHES
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              <li className="hover:text-white cursor-pointer">Impressum</li>
              <li className="hover:text-white cursor-pointer">Datenschutz</li>
              <li className="hover:text-white cursor-pointer">
                Cookie-Einstellungen
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © 2026 Frankfurt Intern e.V.
        </div>
      </div>
    </footer>
  );
}
