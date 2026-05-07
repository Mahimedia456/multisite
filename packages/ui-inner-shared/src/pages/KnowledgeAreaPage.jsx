import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

function EmptyState({ children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="mb-3 h-1 w-14 rounded-full bg-primary" />
      <h2 className="text-3xl font-black tracking-tight text-slate-950">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function KnowledgeAreaPage({
  tenantConfig,
  HeaderSlot,
  FooterSlot,
  lang = "de",
  categories = [],
  articles = [],
  faqs = [],
  forms = [],
  settings = {},
}) {
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

  return (
    <>
      {HeaderSlot ? <HeaderSlot tenant={tenantConfig} /> : null}

      <main className="min-h-screen bg-[#f5f8f8] text-slate-900">
        {!settings?.knowledge_enabled ? (
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm font-bold text-red-700">
              {lang === "en"
                ? "Knowledge area is not available."
                : "Wissensbereich ist nicht verfügbar."}
            </div>
          </section>
        ) : (
          <>
            {/* HERO */}
            <section className="relative overflow-hidden bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />

              <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <div className="mb-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                      {lang === "en" ? "Knowledge Area" : "Wissensbereich"}
                    </div>

                    <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                      {lang === "en"
                        ? "How can we help you?"
                        : "Wie können wir Ihnen helfen?"}
                    </h1>

                    <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-600">
                      {lang === "en"
                        ? "Find articles, FAQs and support forms for your agency."
                        : "Finden Sie Artikel, FAQs und Support-Formulare für Ihre Agentur."}
                    </p>

                    <div className="mt-9 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined pl-3 text-primary">
                          search
                        </span>
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={
                            lang === "en"
                              ? "Search articles and FAQs..."
                              : "Artikel und FAQs suchen..."
                          }
                          className="h-14 w-full bg-transparent px-2 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-2xl bg-primary/10 p-5">
                        <div className="text-3xl font-black text-primary">
                          {articles.length}
                        </div>
                        <div className="mt-1 text-xs font-bold text-slate-500">
                          Artikel
                        </div>
                      </div>
                      <div className="rounded-2xl bg-primary/10 p-5">
                        <div className="text-3xl font-black text-primary">
                          {faqs.length}
                        </div>
                        <div className="mt-1 text-xs font-bold text-slate-500">
                          FAQs
                        </div>
                      </div>
                      <div className="rounded-2xl bg-primary/10 p-5">
                        <div className="text-3xl font-black text-primary">
                          {forms.length}
                        </div>
                        <div className="mt-1 text-xs font-bold text-slate-500">
                          Formulare
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                      <div className="text-sm font-black text-slate-950">
                        {lang === "en" ? "Fast support" : "Schnelle Hilfe"}
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                        {lang === "en"
                          ? "Choose a category, read the guide or send a request directly."
                          : "Wählen Sie eine Kategorie, lesen Sie den passenden Artikel oder senden Sie direkt eine Anfrage."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CATEGORIES */}
            {categories.length ? (
              <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <SectionTitle
                    title={lang === "en" ? "Topics" : "Themenbereiche"}
                    subtitle={
                      lang === "en"
                        ? "Select a topic to quickly find relevant help."
                        : "Wählen Sie einen Bereich, um schneller passende Hilfe zu finden."
                    }
                  />

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft"
                      >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <span className="material-symbols-outlined">
                            folder_open
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-slate-950">
                          {pickLang(cat, "title", lang)}
                        </h3>

                        {pickLang(cat, "description", lang) ? (
                          <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                            {pickLang(cat, "description", lang)}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {/* ARTICLES */}
            {settings.articles_enabled ? (
              <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <SectionTitle
                    title={lang === "en" ? "Articles" : "Artikel"}
                    subtitle={
                      lang === "en"
                        ? "Helpful guides and important information."
                        : "Hilfreiche Anleitungen und wichtige Informationen."
                    }
                  />

                  {filteredArticles.length ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredArticles.map((article) => (
                        <Link
                          key={article.id}
                          to={`/knowledge/articles/${article.slug}`}
                          className="group flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft"
                        >
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">
                              article
                            </span>
                          </div>

                          <h3 className="text-xl font-black leading-snug text-slate-950">
                            {pickLang(article, "title", lang)}
                          </h3>

                          <p className="mt-3 flex-grow text-sm font-semibold leading-7 text-slate-600">
                            {pickLang(article, "excerpt", lang)}
                          </p>

                          <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
                            {lang === "en" ? "Read more" : "Mehr lesen"}
                            <span>→</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState>
                      {lang === "en"
                        ? "No articles found."
                        : "Keine Artikel gefunden."}
                    </EmptyState>
                  )}
                </div>
              </section>
            ) : null}

            {/* FAQ */}
            {settings.faqs_enabled ? (
              <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <SectionTitle
                    title="FAQs"
                    subtitle={
                      lang === "en"
                        ? "Answers to common questions."
                        : "Antworten auf häufige Fragen."
                    }
                  />

                  {filteredFaqs.length ? (
                    <div className="space-y-4">
                      {filteredFaqs.map((faq) => (
                        <details
                          key={faq.id}
                          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all open:border-primary open:shadow-soft"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-slate-950">
                            <span>{pickLang(faq, "question", lang)}</span>
                            <span className="material-symbols-outlined text-primary transition group-open:rotate-180">
                              expand_more
                            </span>
                          </summary>

                          <p className="mt-5 whitespace-pre-wrap border-t border-slate-100 pt-5 text-sm font-semibold leading-8 text-slate-600">
                            {pickLang(faq, "answer", lang)}
                          </p>
                        </details>
                      ))}
                    </div>
                  ) : (
                    <EmptyState>
                      {lang === "en" ? "No FAQs found." : "Keine FAQs gefunden."}
                    </EmptyState>
                  )}
                </div>
              </section>
            ) : null}

            {/* FORMS */}
            {settings.forms_enabled ? (
              <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <SectionTitle
                    title={lang === "en" ? "Forms" : "Formulare"}
                    subtitle={
                      lang === "en"
                        ? "Send us your request directly."
                        : "Senden Sie uns Ihre Anfrage direkt."
                    }
                  />

                  {forms.length ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {forms.map((form) => (
                        <Link
                          key={form.id}
                          to={`/knowledge/forms/${form.slug}`}
                          className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft"
                        >
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">
                              assignment
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-950">
                            {pickLang(form, "title", lang)}
                          </h3>

                          <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
                            {lang === "en" ? "Open form" : "Formular öffnen"}
                            <span>→</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState>
                      {lang === "en"
                        ? "No forms found."
                        : "Keine Formulare gefunden."}
                    </EmptyState>
                  )}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>

      {FooterSlot ? <FooterSlot tenant={tenantConfig} /> : null}
    </>
  );
}