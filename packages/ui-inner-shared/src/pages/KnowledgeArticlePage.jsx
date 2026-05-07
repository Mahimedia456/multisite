import { Link } from "react-router-dom";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

export default function KnowledgeArticlePage({ lang = "de", article }) {
  if (!article) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          {lang === "en" ? "Article not found." : "Artikel nicht gefunden."}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f8fb]">
      <section className="mx-auto max-w-5xl px-5 py-16">
        <Link to="/knowledge" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#007ab3] shadow-sm">
          ← {lang === "en" ? "Back to Knowledge Area" : "Zurück zum Wissensbereich"}
        </Link>

        <article className="mt-8 rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          {article.category_title_de || article.category_title_en ? (
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {pickLang(
                { title_de: article.category_title_de, title_en: article.category_title_en },
                "title",
                lang
              )}
            </div>
          ) : null}

          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {pickLang(article, "title", lang)}
          </h1>

          {pickLang(article, "excerpt", lang) ? (
            <p className="mt-5 text-lg font-semibold leading-8 text-slate-500">
              {pickLang(article, "excerpt", lang)}
            </p>
          ) : null}

          <div className="mt-8 whitespace-pre-wrap text-base font-semibold leading-8 text-slate-700">
            {pickLang(article, "content", lang)}
          </div>
        </article>
      </section>
    </main>
  );
}