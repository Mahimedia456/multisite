import { useEffect, useMemo, useState } from "react";
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
            headline: "Versicherung einfach, menschlich und verständlich machen",
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
                desc: "Klare Tarife und verständliche Beratung ohne versteckte Bedingungen.",
              },
              {
                title: "Vertrauen",
                desc: "Langfristige Unterstützung für Kunden, Familien und Unternehmen.",
              },
              {
                title: "Schnelligkeit",
                desc: "Effiziente Prozesse bei Beratung, Policen und Schadenfällen.",
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

export default function BrandUniquePagesList() {
  const { brandId } = useParams();
  const navigate = useNavigate();

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
      const res = await apiFetch(`/admin/brand-unique-pages/brands/${brandId}/pages`);
      const json = await readJsonResponse(res);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load pages");
      }

      setBrand(json.data.brand);
      setPages(json.data.pages || []);
    } catch (e) {
      alert(e.message || "Failed to load pages");
    } finally {
      setLoading(false);
    }
  }

  async function createPage(slug, title) {
    setCreating(slug);

    try {
      const res = await apiFetch(`/admin/brand-unique-pages/brands/${brandId}/pages`, {
        method: "POST",
        body: {
          slug,
          title,
          status: "PUBLISHED",
          content: getDefaultContent(slug),
        },
      });

      const json = await readJsonResponse(res);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to create page");
      }

      await loadPages();
    } catch (e) {
      alert(e.message || "Failed to create page");
    } finally {
      setCreating("");
    }
  }

  useEffect(() => {
    loadPages();
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

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading pages...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/brand-unique-pages")}
          className="text-sm font-bold text-zinc-400 hover:text-violet-600"
        >
          All Brands ›
        </button>

        <h1 className="mt-2 text-3xl font-black text-zinc-950">
          {brand?.name || "Brand"} Pages
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Brand-specific pages that render only for this brand.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pageExists("home") || creating === "home"}
          onClick={() => createPage("home", "Home")}
          className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Home
        </button>

        <button
          type="button"
          disabled={pageExists("about") || creating === "about"}
          onClick={() => createPage("about", "About")}
          className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          + About
        </button>

        <button
          type="button"
          disabled={pageExists("contact") || creating === "contact"}
          onClick={() => createPage("contact", "Contact")}
          className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Contact
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
            All Pages
          </h2>

          <div className="flex h-10 w-[330px] items-center gap-2 rounded-2xl bg-zinc-100 px-4">
            <MIcon name="search" className="text-[20px] text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 text-left">
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Page Name
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Status
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Latest Version
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Last Modified
              </th>
              <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-widest text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPages.map((page) => {
              const status = String(page.status || "DRAFT").toUpperCase();
              const isPublished = status === "PUBLISHED";

              return (
                <tr key={page.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-100 text-zinc-500">
                        <MIcon name="description" className="text-[20px]" />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/brand-unique-pages/${brandId}/pages/${page.id}/builder`
                            )
                          }
                          className="text-left text-base font-black text-zinc-950 hover:text-violet-600"
                        >
                          {page.title || page.slug}
                        </button>

                        <p className="mt-1 text-xs text-zinc-400">
                          slug: {page.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase",
                        isPublished
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
                      ].join(" ")}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-zinc-700">
                    {page.latestVersion || 0}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-500">
                    {page.modifiedAt
                      ? new Date(page.modifiedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-3 text-zinc-400">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/brand-unique-pages/${brandId}/pages/${page.id}/builder`
                          )
                        }
                        className="hover:text-violet-600"
                        title="Open builder"
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
                        className="hover:text-violet-600"
                        title="Edit"
                      >
                        <MIcon name="edit" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!filteredPages.length && (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-sm text-zinc-500">
                  No pages found. Create Home, About or Contact page first.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="border-t border-zinc-100 px-6 py-5 text-center text-sm text-zinc-400">
          Showing {filteredPages.length} pages
        </div>
      </div>
    </div>
  );
}