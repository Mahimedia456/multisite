import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/auth";
import MIcon from "../components/MIcon";

function getDefaultContent(slug) {
  if (slug === "about") {
    return {
      templateKey: "dropbrand-about-builder",
      sections: [
        {
          id: "about_hero_1",
          type: "AboutHeroSection",
          props: {
            eyebrow: "Über uns",
            headline: "Wir schützen Leben, Werte und Zukunft mit Vertrauen",
            subheading:
              "DropBrand steht für transparente Beratung, verlässlichen Schutz und moderne Versicherungslösungen.",
          },
        },
        {
          id: "about_intro_1",
          type: "AboutIntroSection",
          props: {
            eyebrow: "Unsere Mission",
            headline:
              "Versicherung einfach, menschlich und verständlich machen",
            body:
              "Wir helfen Menschen, Familien und Unternehmen dabei, die richtige Absicherung zu finden. Unser Ziel ist es, komplexe Versicherungen klar zu erklären und passende Lösungen bereitzustellen.",
            image:
              "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200",
          },
        },
        {
          id: "about_values_1",
          type: "AboutValuesSection",
          props: {
            eyebrow: "Unsere Werte",
            headline: "Wofür wir stehen",
            items: [
              {
                title: "Transparenz",
                desc:
                  "Klare Tarife und verständliche Beratung ohne versteckte Bedingungen.",
              },
              {
                title: "Vertrauen",
                desc:
                  "Langfristige Unterstützung für Kunden, Familien und Unternehmen.",
              },
              {
                title: "Schnelligkeit",
                desc:
                  "Effiziente Prozesse bei Beratung, Policen und Schadenfällen.",
              },
            ],
          },
        },
      ],
    };
  }

  if (slug === "contact") {
    return {
      templateKey: "dropbrand-contact-builder",
      sections: [
        {
          id: "contact_hero_1",
          type: "ContactHeroSection",
          props: {
            eyebrow: "Kontakt",
            headline: "Fragen? Wir beraten Sie persönlich",
            subheading:
              "Unser Team hilft Ihnen, den passenden Versicherungsschutz zu finden.",
          },
        },
        {
          id: "contact_info_1",
          type: "ContactInfoSection",
          props: {
            eyebrow: "Kontaktinformationen",
            headline: "Sprechen Sie direkt mit unserem Team",
            phone: "+49 000 000 000",
            email: "kontakt@dropbrand.de",
            address: "Musterstraße 12, 60311 Frankfurt am Main",
            hours: "Mo - Fr: 09:00 - 18:00 Uhr",
          },
        },
        {
          id: "contact_form_1",
          type: "ContactFormSection",
          props: {
            eyebrow: "Nachricht senden",
            headline: "Wir melden uns schnellstmöglich bei Ihnen",
            subheading:
              "Füllen Sie das Formular aus und unser Beratungsteam kontaktiert Sie.",
            formTitle: "Kontakt aufnehmen",
            buttonLabel: "Nachricht senden",
          },
        },
        {
          id: "contact_faq_1",
          type: "ContactFAQSection",
          props: {
            eyebrow: "FAQ",
            headline: "Häufige Fragen vor dem Kontakt",
            items: [
              {
                q: "Wie schnell meldet sich das Team?",
                a: "In der Regel melden wir uns innerhalb eines Werktages zurück.",
              },
              {
                q: "Kann ich eine persönliche Beratung buchen?",
                a: "Ja, unser Team bietet persönliche Beratung passend zu Ihrem Bedarf.",
              },
              {
                q: "Kostet die erste Anfrage etwas?",
                a: "Nein, die erste Anfrage ist unverbindlich und kostenlos.",
              },
            ],
          },
        },
      ],
    };
  }

  return {
    templateKey: "dropbrand-home-builder",
    sections: [],
  };
}

function StatusPill({ status }) {
  const s = String(status || "DRAFT").toUpperCase();
  const isPublished = s === "PUBLISHED" || s === "LIVE" || s === "ACTIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase border",
        isPublished
          ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40"
          : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40",
      ].join(" ")}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full",
          isPublished ? "bg-green-500" : "bg-amber-500",
        ].join(" ")}
      />
      {s}
    </span>
  );
}

function StatCard({ title, value, note, icon }) {
  return (
    <div className="group rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#007ab3]/10 transition-all p-6 overflow-hidden relative">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#007ab3]/10 group-hover:bg-[#007ab3]/15 transition" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
            {title}
          </div>

          <div className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
            {value}
          </div>

          <div className="mt-2 text-sm font-bold text-[#007ab3]">
            {note}
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#007ab3] to-[#005f8c] text-white flex items-center justify-center shadow-lg shadow-[#007ab3]/20">
          <MIcon name={icon} className="text-[22px]" />
        </div>
      </div>
    </div>
  );
}

export default function BrandUniquePagesList() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [brand, setBrand] = useState(null);
  const [pages, setPages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState("");

  async function readJsonResponse(res) {
    const text = await res.text();

    try {
      return text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`API returned non-JSON response: ${text.slice(0, 120)}`);
    }
  }

  async function loadPages() {
    setLoading(true);

    try {
      const res = await apiFetch(
        `/admin/brand-unique-pages/brands/${brandId}/pages`
      );

      const json = await readJsonResponse(res);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("uniquePageListFailedLoad"));
      }

      setBrand(json.data.brand);
      setPages(json.data.pages || []);
    } catch (e) {
      alert(e.message || t("uniquePageListFailedLoad"));
    } finally {
      setLoading(false);
    }
  }

  async function createPage(slug, title) {
    setCreating(slug);

    try {
      const res = await apiFetch(
        `/admin/brand-unique-pages/brands/${brandId}/pages`,
        {
          method: "POST",
          body: {
            slug,
            title,
            status: "PUBLISHED",
            content: getDefaultContent(slug),
          },
        }
      );

      const json = await readJsonResponse(res);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("uniquePageListFailedCreate"));
      }

      await loadPages();
    } catch (e) {
      alert(e.message || t("uniquePageListFailedCreate"));
    } finally {
      setCreating("");
    }
  }

  useEffect(() => {
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return pages;

    return pages.filter((page) => {
      return (
        String(page.title || "").toLowerCase().includes(q) ||
        String(page.slug || "").toLowerCase().includes(q) ||
        String(page.status || "").toLowerCase().includes(q)
      );
    });
  }, [pages, query]);

  const pageExists = (slug) =>
    pages.some((page) => String(page.slug || "").toLowerCase() === slug);

  const publishedCount = pages.filter((page) =>
    ["PUBLISHED", "LIVE", "ACTIVE"].includes(
      String(page.status || "").toUpperCase()
    )
  ).length;

  const draftCount = pages.length - publishedCount;

  if (loading) {
    return (
      <div className="p-8 text-slate-500 dark:text-slate-400">
        {t("uniquePageListLoading")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <button
            type="button"
            onClick={() => navigate("/brand-unique-pages")}
            className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3] hover:opacity-80"
          >
            {t("uniquePageListAllBrands")} ›
          </button>

          <h1 className="mt-2 text-2xl font-black text-gray-950 dark:text-white">
            {brand?.name || t("uniquePageListBrandFallback")}{" "}
            {t("uniquePageListPages")}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("uniquePageListDescription")}
          </p>
        </div>

        <div className="relative w-full xl:w-80">
          <MIcon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("uniquePageListSearchPlaceholder")}
            className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-gray-950 dark:text-white placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3] transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t("uniquePageListAllPages")}
          value={String(pages.length)}
          note={t("uniquePageListShowing", { count: pages.length })}
          icon="web"
        />

        <StatCard
          title="Published"
          value={String(publishedCount)}
          note="Live pages"
          icon="check_circle"
        />

        <StatCard
          title="Draft"
          value={String(draftCount)}
          note="Inactive / draft pages"
          icon="edit_document"
        />
      </div>

      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pageExists("home") || creating === "home"}
            onClick={() => createPage("home", t("uniquePageListHome"))}
            className="h-11 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            + {t("uniquePageListHome")}
          </button>

          <button
            type="button"
            disabled={pageExists("about") || creating === "about"}
            onClick={() => createPage("about", t("uniquePageListAbout"))}
            className="h-11 rounded-2xl bg-slate-950 dark:bg-white px-5 text-sm font-black text-white dark:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            + {t("uniquePageListAbout")}
          </button>

          <button
            type="button"
            disabled={pageExists("contact") || creating === "contact"}
            onClick={() => createPage("contact", t("uniquePageListContact"))}
            className="h-11 rounded-2xl bg-slate-950 dark:bg-white px-5 text-sm font-black text-white dark:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            + {t("uniquePageListContact")}
          </button>
        </div>
      </div>

      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-[#007ab3]">
            {t("uniquePageListAllPages")}
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("uniquePageListShowing", { count: filteredPages.length })}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 text-left">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePageListPageName")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePageListStatus")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePageListLatestVersion")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePageListLastModified")}
                </th>

                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePageListActions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {filteredPages.map((page) => (
                <tr
                  key={page.id}
                  className="hover:bg-[#007ab3]/5 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3] shrink-0">
                        <MIcon name="description" className="text-[21px]" />
                      </div>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/brand-unique-pages/${brandId}/pages/${page.id}/builder`
                            )
                          }
                          className="block text-left text-base font-black text-gray-950 dark:text-white hover:text-[#007ab3] transition truncate"
                        >
                          {page.title || page.slug}
                        </button>

                        <p className="mt-1 text-xs font-semibold text-slate-400 truncate">
                          {t("uniquePageListSlug")}: {page.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <StatusPill status={page.status} />
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-gray-950 dark:text-white">
                    {page.latestVersion || 0}
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {page.modifiedAt
                      ? new Date(page.modifiedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/brand-unique-pages/${brandId}/pages/${page.id}/builder`
                          )
                        }
                        className="w-9 h-9 rounded-xl hover:text-[#007ab3] hover:bg-[#007ab3]/10 transition"
                        title={t("uniquePageListOpenBuilder")}
                      >
                        <MIcon name="settings" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/brand-unique-pages/${brandId}/pages/${page.id}/builder`
                          )
                        }
                        className="w-9 h-9 rounded-xl hover:text-[#007ab3] hover:bg-[#007ab3]/10 transition"
                        title={t("uniquePageListEdit")}
                      >
                        <MIcon name="edit" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredPages.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center text-sm text-slate-500"
                  >
                    {t("uniquePageListNoPages")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-6 py-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          {t("uniquePageListShowing", { count: filteredPages.length })}
        </div>
      </div>
    </div>
  );
}