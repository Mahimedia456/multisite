import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useBrandKnowledge } from "../hooks/useBrandKnowledge";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

export default function KnowledgeAreaPage({ brandSlug, lang = "de" }) {
  const { categories, articles, faqs, forms, settings, loading, error } =
    useBrandKnowledge(brandSlug);

  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const title = pickLang(item, "title", lang).toLowerCase();
      const excerpt = pickLang(item, "excerpt", lang).toLowerCase();
      return !q || title.includes(q) || excerpt.includes(q);
    });
  }, [articles, q, lang]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const question = pickLang(item, "question", lang).toLowerCase();
      const answer = pickLang(item, "answer", lang).toLowerCase();
      return !q || question.includes(q) || answer.includes(q);
    });
  }, [faqs, q, lang]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
          Wird geladen...
        </div>
      </main>
    );
  }

  if (error || !settings?.knowledge_enabled) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          Wissensbereich ist nicht verfügbar.
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f8fb]">
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[36px] bg-gradient-to-br from-[#007ab3] to-[#005f8c] p-8 text-white shadow-xl">
          <div className="text-sm font-black uppercase tracking-[0.22em] text-white/80">
            {lang === "en" ? "Knowledge Area" : "Wissensbereich"}
          </div>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            {lang === "en"
              ? "How can we help you?"
              : "Wie können wir Ihnen helfen?"}
          </h1>

          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/85">
            {lang === "en"
              ? "Find articles, FAQs, and support forms for your agency."
              : "Finden Sie Artikel, FAQs und Support-Formulare für Ihre Agentur."}
          </p>

          <div className="mt-8 max-w-2xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === "en"
                  ? "Search articles and FAQs..."
                  : "Artikel und FAQs suchen..."
              }
              className="w-full rounded-2xl border border-white/20 bg-white px-5 py-4 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {categories.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-lg font-black text-slate-950">
                  {pickLang(cat, "title", lang)}
                </div>

                {pickLang(cat, "description", lang) ? (
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    {pickLang(cat, "description", lang)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {settings.articles_enabled ? (
          <section className="mt-12">
            <h2 className="text-2xl font-black text-slate-950">
              {lang === "en" ? "Articles" : "Artikel"}
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/knowledge/articles/${article.slug}`}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="text-lg font-black text-slate-950">
                    {pickLang(article, "title", lang)}
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                    {pickLang(article, "excerpt", lang)}
                  </p>

                  <div className="mt-5 text-sm font-black text-[#007ab3]">
                    {lang === "en" ? "Read more" : "Mehr lesen"} →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {settings.faqs_enabled ? (
          <section className="mt-12">
            <h2 className="text-2xl font-black text-slate-950">FAQs</h2>

            <div className="mt-5 space-y-4">
              {filteredFaqs.map((faq) => (
                <details
                  key={faq.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <summary className="cursor-pointer text-lg font-black text-slate-950">
                    {pickLang(faq, "question", lang)}
                  </summary>

                  <p className="mt-4 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
                    {pickLang(faq, "answer", lang)}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {settings.forms_enabled ? (
          <section className="mt-12">
            <h2 className="text-2xl font-black text-slate-950">
              {lang === "en" ? "Forms" : "Formulare"}
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {forms.map((form) => (
                <Link
                  key={form.id}
                  to={`/knowledge/forms/${form.slug}`}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="text-lg font-black text-slate-950">
                    {pickLang(form, "title", lang)}
                  </div>

                  <div className="mt-4 text-sm font-black text-[#007ab3]">
                    {lang === "en" ? "Open form" : "Formular öffnen"} →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}