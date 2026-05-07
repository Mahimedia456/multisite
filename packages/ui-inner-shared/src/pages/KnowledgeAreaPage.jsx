import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

function IconBox({ icon }) {
  return (
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
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

      <main className="bg-[#f5f8f8] text-slate-900">
        {!settings?.knowledge_enabled ? (
          <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                {lang === "en" ? "Knowledge Area" : "Wissensbereich"}
              </div>
              <h1 className="text-4xl font-black text-slate-950">
                {lang === "en"
                  ? "Knowledge area is currently not available."
                  : "Der Wissensbereich ist momentan nicht verfügbar."}
              </h1>
            </div>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden bg-white py-24">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />
              <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                  <div className="mb-5 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                    {lang === "en" ? "Knowledge Area" : "Wissensbereich"}
                  </div>

                  <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
                    {lang === "en" ? "How can we help you?" : "Wie können wir Ihnen helfen?"}
                  </h1>

                  <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
                    {lang === "en"
                      ? "Find answers, useful guides and direct support forms for your insurance questions."
                      : "Finden Sie Antworten, hilfreiche Ratgeber und passende Formulare für Ihre Versicherungsfragen."}
                  </p>

                  <div className="mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined pl-4 text-primary">search</span>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={lang === "en" ? "Search help topics..." : "Hilfethemen suchen..."}
                        className="h-14 w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-primary p-8 text-white shadow-soft-lg">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/10 p-5">
                      <div className="text-4xl font-black">{articles.length}</div>
                      <div className="mt-1 text-sm font-bold text-white/80">Artikel</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-5">
                      <div className="text-4xl font-black">{faqs.length}</div>
                      <div className="mt-1 text-sm font-bold text-white/80">FAQs</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-5">
                      <div className="text-4xl font-black">{forms.length}</div>
                      <div className="mt-1 text-sm font-bold text-white/80">Formulare</div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/20 p-6">
                    <h3 className="text-2xl font-black">
                      {lang === "en" ? "Quick support" : "Schnelle Unterstützung"}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-white/80">
                      {lang === "en"
                        ? "Choose a topic, read an article or submit your request directly."
                        : "Wählen Sie ein Thema, lesen Sie einen Artikel oder senden Sie Ihre Anfrage direkt."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {categories.length ? (
              <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-12">
                    <h2 className="text-4xl font-black text-slate-950">
                      {lang === "en" ? "Choose your topic" : "Wählen Sie Ihr Thema"}
                    </h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-soft">
                        <IconBox icon="folder_open" />
                        <h3 className="text-2xl font-black text-slate-950">{pickLang(cat, "title", lang)}</h3>
                        <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{pickLang(cat, "description", lang)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {settings.articles_enabled ? (
              <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-12">
                    <h2 className="text-4xl font-black text-slate-950">Artikel</h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.map((article) => (
                      <Link key={article.id} to={`/knowledge/articles/${article.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-soft">
                        <IconBox icon="article" />
                        <h3 className="text-2xl font-black leading-snug text-slate-950">{pickLang(article, "title", lang)}</h3>
                        <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{pickLang(article, "excerpt", lang)}</p>
                        <div className="mt-7 font-black text-primary">Mehr lesen →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {settings.faqs_enabled ? (
              <section className="py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-12 text-center">
                    <h2 className="text-4xl font-black text-slate-950">Häufige Fragen</h2>
                  </div>

                  <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <details key={faq.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm open:border-primary open:shadow-soft">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-slate-950">
                          {pickLang(faq, "question", lang)}
                          <span className="material-symbols-outlined text-primary transition group-open:rotate-180">expand_more</span>
                        </summary>
                        <p className="mt-5 border-t border-slate-100 pt-5 text-sm font-semibold leading-8 text-slate-600">
                          {pickLang(faq, "answer", lang)}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {settings.forms_enabled ? (
              <section className="bg-primary py-24 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-12">
                    <h2 className="text-4xl font-black">Direkt anfragen</h2>
                    <p className="mt-4 max-w-2xl text-white/80">
                      Wählen Sie das passende Formular und senden Sie Ihre Anfrage direkt an uns.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {forms.map((form) => (
                      <Link key={form.id} to={`/knowledge/forms/${form.slug}`} className="rounded-2xl bg-white p-8 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-soft-lg">
                        <IconBox icon="assignment" />
                        <h3 className="text-2xl font-black">{pickLang(form, "title", lang)}</h3>
                        <div className="mt-7 font-black text-primary">Formular öffnen →</div>
                      </Link>
                    ))}
                  </div>
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