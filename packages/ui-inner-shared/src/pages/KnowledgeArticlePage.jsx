import { Link } from "react-router-dom";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

export default function KnowledgeArticlePage({
  tenantConfig,
  HeaderSlot,
  FooterSlot,
  lang = "de",
  article,
}) {
  return (
    <>
      {HeaderSlot ? <HeaderSlot tenant={tenantConfig} /> : null}

      <main className="bg-[#f5f8f8] text-slate-900">
        {!article ? (
          <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
              <h1 className="text-4xl font-black text-slate-950">
                {lang === "en" ? "Article not found." : "Artikel nicht gefunden."}
              </h1>
            </div>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden bg-white py-24">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />

              <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <Link
                  to="/knowledge"
                  className="inline-flex items-center rounded-full border-2 border-primary px-5 py-3 text-sm font-black text-primary transition hover:bg-primary hover:text-white"
                >
                  ← {lang === "en" ? "Back to Knowledge Area" : "Zurück zum Wissensbereich"}
                </Link>

                <div className="mt-12">
                  {article.category_title_de || article.category_title_en ? (
                    <div className="mb-5 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                      {pickLang(
                        {
                          title_de: article.category_title_de,
                          title_en: article.category_title_en,
                        },
                        "title",
                        lang
                      )}
                    </div>
                  ) : null}

                  <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
                    {pickLang(article, "title", lang)}
                  </h1>

                  {pickLang(article, "excerpt", lang) ? (
                    <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
                      {pickLang(article, "excerpt", lang)}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="py-20">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
                  <div className="whitespace-pre-wrap text-lg font-semibold leading-9 text-slate-700">
                    {pickLang(article, "content", lang)}
                  </div>
                </article>

                <div className="mt-10 rounded-2xl bg-primary p-8 text-white shadow-soft">
                  <h3 className="text-3xl font-black">
                    {lang === "en" ? "Need more help?" : "Benötigen Sie weitere Hilfe?"}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/80">
                    {lang === "en"
                      ? "Use the knowledge area to find forms, FAQs and further information."
                      : "Nutzen Sie den Wissensbereich, um Formulare, FAQs und weitere Informationen zu finden."}
                  </p>

                  <Link
                    to="/knowledge"
                    className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-black text-primary transition hover:bg-white/90"
                  >
                    {lang === "en" ? "Open Knowledge Area" : "Wissensbereich öffnen"}
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {FooterSlot ? <FooterSlot tenant={tenantConfig} /> : null}
    </>
  );
}