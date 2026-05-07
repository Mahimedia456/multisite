import { Link } from "react-router-dom";

export default function Shared404Page({
  tenantConfig,
  HeaderSlot,
  FooterSlot,
  lang = "de",
  title,
  subtitle,
  homeLabel,
  supportLabel,
  supportHref = "/contact",
}) {
  const finalTitle =
    title ||
    (lang === "en"
      ? "Page not found"
      : "Seite nicht gefunden");

  const finalSubtitle =
    subtitle ||
    (lang === "en"
      ? "The page you are looking for does not exist or may have been moved."
      : "Die gesuchte Seite existiert nicht oder wurde möglicherweise verschoben.");

  const finalHomeLabel =
    homeLabel ||
    (lang === "en" ? "Back to home" : "Zur Startseite");

  const finalSupportLabel =
    supportLabel ||
    (lang === "en" ? "Contact support" : "Kontakt aufnehmen");

  return (
    <>
      {HeaderSlot ? <HeaderSlot tenant={tenantConfig} /> : null}

      <main className="bg-[#f5f8f8] text-slate-900">
        <section className="relative min-h-[72vh] overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />

          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                404
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
                {finalTitle}
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
                {finalSubtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  {finalHomeLabel}
                </Link>

                <Link
                  to={supportHref}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-primary px-7 py-4 text-sm font-black text-primary transition hover:bg-primary hover:text-white"
                >
                  {finalSupportLabel}
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-primary p-8 text-white shadow-soft-lg">
              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-8">
                <div className="text-[110px] font-black leading-none tracking-tight text-white md:text-[150px]">
                  404
                </div>

                <div className="mt-6 h-1 w-20 rounded-full bg-white" />

                <h2 className="mt-8 text-3xl font-black">
                  {lang === "en" ? "Lost your way?" : "Verlaufen?"}
                </h2>

                <p className="mt-4 text-sm font-semibold leading-7 text-white/80">
                  {lang === "en"
                    ? "Use the navigation above or return to the homepage to continue."
                    : "Nutzen Sie die Navigation oben oder kehren Sie zur Startseite zurück."}
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-sm font-bold">
                      {lang === "en" ? "Homepage" : "Startseite"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <span className="material-symbols-outlined">support_agent</span>
                    <span className="text-sm font-bold">
                      {lang === "en" ? "Support" : "Kontakt"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <span className="material-symbols-outlined">travel_explore</span>
                    <span className="text-sm font-bold">
                      {lang === "en" ? "Navigation" : "Navigation"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {FooterSlot ? <FooterSlot tenant={tenantConfig} /> : null}
    </>
  );
}