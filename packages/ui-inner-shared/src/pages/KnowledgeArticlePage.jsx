import { Link } from "react-router-dom";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

export default function KnowledgeArticlePage({ lang = "de", article }) {
  if (!article) {
    return (
      <main className="min-h-screen bg-[#f5f8f8] text-slate-900">
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm font-bold text-red-700">
            {lang === "en" ? "Article not found." : "Artikel nicht gefunden."}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-slate-900">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>←</span>
            {lang === "en" ? "Back to Knowledge Area" : "Zurück zum Wissensbereich"}
          </Link>

          <div className="mt-10">
            {article.category_title_de || article.category_title_en ? (
              <div className="mb-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
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

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
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

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-base font-semibold leading-8 text-slate-700">
              {pickLang(article, "content", lang)}
            </div>
          </div>
        </article>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {lang === "en" ? "Need more help?" : "Benötigen Sie weitere Hilfe?"}
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {lang === "en"
                  ? "Send us a request through the knowledge forms."
                  : "Senden Sie uns eine Anfrage über die Formulare im Wissensbereich."}
              </p>
            </div>

            <Link
              to="/knowledge"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              {lang === "en" ? "Open Knowledge Area" : "Wissensbereich öffnen"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}