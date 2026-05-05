import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

const IMG_1 =
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200";
const IMG_2 =
  "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=900";
const IMG_3 =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=900";

const SECTION_LIBRARY = {
  HeroSection: {
    labelKey: "uniqueBuilderHero",
    defaults: {
      badge: "Versicherungslösungen",
      ctaHref: "/contact",
      ctaLabel: "Kostenloses Angebot",
      headline: "Schützen Sie, was wirklich zählt",
      subheading:
        "Von Gesundheit und Leben bis Fahrzeug und Eigentum – DropBrand macht Versicherung einfach, transparent und passend.",
      trustText: "Vertraut von mehr als 100 Unternehmen",
      highlights: [
        "Lebensversicherung",
        "Schnelle Schadenhilfe",
        "Transparente Policen",
        "24/7 Support",
      ],
    },
  },

  AboutSection: {
    labelKey: "uniqueBuilderAbout",
    defaults: {
      eyebrow: "Über uns",
      headline: "Wir schützen Leben, Werte und Zukunft mit Vertrauen",
      body:
        "Wir bieten zuverlässige Versicherungslösungen für Privatpersonen, Familien und Unternehmen – mit klarer Beratung, ehrlicher Absicherung und verlässlichem Service.",
      quote:
        "Versicherung bedeutet nicht nur Policen. Es geht darum, Menschen, Träume und Zukunft zu schützen.",
      image1: IMG_1,
      image2: IMG_2,
      statValue: "80+",
      statLabel: "Auszeichnungen",
      buttonLabel: "Mehr über uns",
      buttonHref: "/about",
    },
  },

  ServicesSection: {
    labelKey: "uniqueBuilderServices",
    defaults: {
      eyebrow: "Unsere Leistungen",
      headline: "Versicherungsschutz, der Sicherheit und Vertrauen gibt",
      buttonLabel: "Alle Leistungen ansehen",
      buttonHref: "/services",
      items: [
        {
          title: "Lebensversicherung",
          desc: "Sichern Sie die Zukunft Ihrer Familie mit flexiblen Versicherungslösungen.",
          img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900",
        },
        {
          title: "Krankenversicherung",
          desc: "Erhalten Sie zuverlässige Unterstützung für medizinische Kosten und Versorgung.",
          img: IMG_3,
        },
        {
          title: "Fahrzeugversicherung",
          desc: "Fahren Sie mit Sicherheit, wenn es darauf ankommt.",
          img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900",
        },
      ],
    },
  },

  WhyChooseSection: {
    labelKey: "uniqueBuilderWhyChoose",
    defaults: {
      eyebrow: "Warum wir",
      headline: "Erfahrene Versicherungslösung mit persönlicher Beratung",
      body:
        "Wir verbinden Fachwissen, transparente Policen und engagierten Support, damit Sie langfristig sicher entscheiden können.",
      image: IMG_1,
      quote:
        "Das Team hat jede Option verständlich erklärt und den Prozess einfach gemacht.",
      author: "Ronald Richards",
      items: [
        "Transparente Preise ohne versteckte Gebühren",
        "Erfahrene Berater vom ersten Gespräch an",
        "Schnelle und einfache Schadenabwicklung",
        "Flexible Tarife passend zu Ihrem Bedarf",
      ],
    },
  },

  VideoStorySection: {
    labelKey: "uniqueBuilderVideoStory",
    defaults: {
      eyebrow: "Unsere Geschichte",
      headline: "Entdecken Sie die Geschichte hinter unserem Schutzversprechen",
      image: IMG_1,
      marquee: [
        "Lebensversicherung",
        "Schnelle Schäden",
        "Transparente Policen",
        "24/7 Support",
        "Verlässlicher Schutz",
        "Krankenversicherung",
      ],
    },
  },

  FeaturesSection: {
    labelKey: "uniqueBuilderFeatures",
    defaults: {
      cardTitle: "Persönliche Expertenberatung",
      cardBody:
        "Unsere erfahrenen Berater helfen Ihnen, Tarife zu vergleichen und den passenden Schutz zu wählen.",
      cardItems: [
        "Policenverwaltung",
        "Schadenservice",
        "Firmenversicherung",
        "Flexible Absicherung",
      ],
      eyebrow: "Kernvorteile",
      headline: "Funktionen, die unseren Service besonders machen",
      features: [
        "Transparent und leicht verständlich",
        "Schnelle und einfache Schadenabwicklung",
        "Sicherer und verlässlicher Service",
      ],
      stat1: "98%",
      stat1Label: "Support-Zufriedenheit",
      stat2: "500+",
      stat2Label: "Gelöste Schäden",
    },
  },

  PricingSection: {
    labelKey: "uniqueBuilderPricing",
    defaults: {
      eyebrow: "Tarife",
      headline: "Bezahlbarer Schutz, der zu Ihnen passt",
      subheading: "Klare Tarife, verständliche Leistungen und flexible Optionen.",
      buttonLabel: "Starten",
      plans: [
        {
          name: "Basis",
          price: "49 €",
          features: ["Schnelle Bearbeitung", "Grundschutz", "E-Mail Support"],
        },
        {
          name: "Standard",
          price: "89 €",
          hot: true,
          features: ["Priorisierte Schäden", "Berater-Support", "Fahrzeug-Zusatz"],
        },
        {
          name: "Premium",
          price: "149 €",
          features: ["Vollschutz", "24/7 Support", "Business-Schutz"],
        },
      ],
    },
  },

  ContactSection: {
    labelKey: "uniqueBuilderContact",
    defaults: {
      eyebrow: "Kontakt",
      headline: "Fragen? Wir beraten Sie persönlich",
      subheading:
        "Unser Team hilft Ihnen, den passenden Versicherungsschutz zu finden.",
      phone: "+49 000 000 000",
      formTitle: "Kontakt aufnehmen",
      buttonLabel: "Nachricht senden",
    },
  },

  FAQSection: {
    labelKey: "uniqueBuilderFAQ",
    defaults: {
      eyebrow: "FAQ",
      headline: "Häufige Fragen zu Schutz und Leistungen",
      subheading: "Hier finden Sie schnelle Antworten auf die wichtigsten Fragen.",
      items: [
        {
          q: "Wie wähle ich den richtigen Tarif?",
          a: "Unsere Berater vergleichen Optionen und erklären die Leistungen verständlich.",
        },
        {
          q: "Welche Versicherungen bieten Sie an?",
          a: "Wir bieten unter anderem Lebens-, Kranken-, Fahrzeug- und Sachversicherungen.",
        },
      ],
    },
  },

  TestimonialsSection: {
    labelKey: "uniqueBuilderTestimonials",
    defaults: {
      eyebrow: "Kundenstimmen",
      headline: "Vertrauen durch echte Erfahrungen",
      image: IMG_1,
      rating: "★★★★★",
      quote:
        "Das Team hat meine Bedürfnisse verstanden und jede Option klar erklärt. Der gesamte Prozess war einfach und professionell.",
      name: "Robert Fox",
      role: "Unternehmer",
    },
  },

  BlogSection: {
    labelKey: "uniqueBuilderBlog",
    defaults: {
      eyebrow: "Aktuelle Beiträge",
      headline: "Neuigkeiten, Ratgeber und Updates",
      posts: [
        {
          title: "So wählen Sie den richtigen Versicherungsschutz",
          image: IMG_1,
        },
        {
          title: "5 häufige Fehler bei Versicherungen vermeiden",
          image: IMG_2,
        },
        {
          title: "Krankenversicherung einfach erklärt",
          image: IMG_3,
        },
      ],
    },
  },
};

function getSectionLabel(type, t) {
  const def = SECTION_LIBRARY[type];
  if (!def) return type;
  return def.labelKey ? t(def.labelKey) : def.label || type;
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;

  const next = [...arr];
  const item = next.splice(from, 1)[0];
  next.splice(to, 0, item);

  return next;
}

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>

      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
      />
    </div>
  );
}

function updateProp(sections, index, key, value) {
  return sections.map((section, i) =>
    i === index
      ? { ...section, props: { ...(section.props || {}), [key]: value } }
      : section
  );
}

function GenericEditor({ section, onChange, t }) {
  const props = section?.props || {};

  function updateArrayItem(key, idx, field, value) {
    const arr = Array.isArray(props[key]) ? [...props[key]] : [];
    arr[idx] = { ...(arr[idx] || {}), [field]: value };
    onChange(key, arr);
  }

  function removeArrayItem(key, idx) {
    const arr = Array.isArray(props[key]) ? [...props[key]] : [];
    onChange(
      key,
      arr.filter((_, i) => i !== idx)
    );
  }

  function addArrayItem(key, arr) {
    const sample = arr[0];
    const lower = key.toLowerCase();

    if (typeof sample === "string") {
      onChange(key, [...arr, t("uniqueBuilderNewItem")]);
      return;
    }

    if (lower.includes("plan")) {
      onChange(key, [
        ...arr,
        {
          name: t("uniqueBuilderNewPlan"),
          price: t("uniqueBuilderPlanPrice"),
          features: [t("uniqueBuilderFeatureOne"), t("uniqueBuilderFeatureTwo")],
        },
      ]);
      return;
    }

    if (lower.includes("post")) {
      onChange(key, [
        ...arr,
        { title: t("uniqueBuilderNewPost"), image: IMG_1 },
      ]);
      return;
    }

    if (lower.includes("item") && sample?.q !== undefined) {
      onChange(key, [
        ...arr,
        {
          q: t("uniqueBuilderNewQuestion"),
          a: t("uniqueBuilderNewAnswer"),
        },
      ]);
      return;
    }

    onChange(key, [
      ...arr,
      {
        title: t("uniqueBuilderNewTitle"),
        desc: t("uniqueBuilderDescription"),
        img: IMG_1,
      },
    ]);
  }

  return (
    <div className="space-y-4">
      {Object.entries(props).map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="space-y-3">
              <div className="text-xs font-black uppercase text-zinc-500">
                {key}
              </div>

              {value.map((item, idx) => {
                if (typeof item === "string") {
                  return (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={item}
                        onChange={(e) => {
                          const arr = [...value];
                          arr[idx] = e.target.value;
                          onChange(key, arr);
                        }}
                        className="flex-1 rounded-xl border px-3 py-2 text-sm"
                      />

                      <button
                        type="button"
                        onClick={() => removeArrayItem(key, idx)}
                        className="text-red-600"
                        title={t("uniqueBuilderRemoveItem")}
                      >
                        <MIcon name="delete" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="space-y-3 rounded-2xl border border-zinc-200 p-3"
                  >
                    {Object.entries(item || {}).map(([field, fieldValue]) => {
                      if (Array.isArray(fieldValue)) {
                        return (
                          <div key={field} className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">
                              {field}
                            </label>

                            {fieldValue.map((x, subIdx) => (
                              <input
                                key={subIdx}
                                value={x}
                                onChange={(e) => {
                                  const arr = Array.isArray(props[key])
                                    ? [...props[key]]
                                    : [];
                                  const nextItem = { ...(arr[idx] || {}) };
                                  const nextSub = [...fieldValue];

                                  nextSub[subIdx] = e.target.value;
                                  nextItem[field] = nextSub;
                                  arr[idx] = nextItem;

                                  onChange(key, arr);
                                }}
                                className="w-full rounded-xl border px-3 py-2 text-sm"
                              />
                            ))}
                          </div>
                        );
                      }

                      return (
                        <TextInput
                          key={field}
                          label={field}
                          value={fieldValue}
                          onChange={(v) => updateArrayItem(key, idx, field, v)}
                        />
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => removeArrayItem(key, idx)}
                      className="text-xs font-bold text-red-600"
                    >
                      {t("uniqueBuilderRemoveItem")}
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => addArrayItem(key, value)}
                className="rounded-xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-700"
              >
                + {t("uniqueBuilderAdd")} {key}
              </button>
            </div>
          );
        }

        const lowerKey = String(key).toLowerCase();

        if (
          lowerKey.includes("body") ||
          lowerKey.includes("subheading") ||
          lowerKey.includes("quote") ||
          lowerKey.includes("description")
        ) {
          return (
            <TextArea
              key={key}
              label={key}
              value={value}
              onChange={(v) => onChange(key, v)}
            />
          );
        }

        return (
          <TextInput
            key={key}
            label={key}
            value={value}
            onChange={(v) => onChange(key, v)}
          />
        );
      })}
    </div>
  );
}

export default function BrandUniquePageBuilder() {
  const { brandId, pageId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(Date.now());

  const selected = sections[selectedIdx] || null;

  const content = useMemo(
    () => ({
      templateKey: "dropbrand-home-builder",
      sections,
    }),
    [sections]
  );
const brandSlug = page?.brandSlug || page?.brand_slug || "";

const previewBaseUrl = String(page?.brandPreviewUrl || page?.websiteUrl || "").replace(
  /\/+$/,
  ""
);

const pageSlug = page?.slug || "home";

const previewUrl = previewBaseUrl
  ? `${previewBaseUrl}/admin-preview/${pageSlug}?pageId=${pageId}&preview=${previewVersion}`
  : "";
  
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      try {
        const res = await apiFetch(`/admin/brand-unique-pages/${pageId}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || t("uniqueBuilderFailedLoadPage"));
        }

        const latest = json.data?.latestVersion?.content;
        const nextSections = Array.isArray(latest?.sections)
          ? latest.sections
          : [];

        if (alive) {
          setPage(json.data?.page);
          setSections(nextSections);
          setSelectedIdx(0);
          setPreviewVersion(Date.now());
        }
      } catch (e) {
        alert(e?.message || t("uniqueBuilderFailedLoadBuilder"));
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [pageId, t]);

  function selectSection(idx) {
    setSelectedIdx(idx);
  }

  function addSection(type) {
    const def = SECTION_LIBRARY[type];

    if (!def) return;

    const next = [
      ...sections,
      {
        id: uid(),
        type,
        props: clone(def.defaults),
      },
    ];

    setSections(next);
    setSelectedIdx(next.length - 1);
  }

  function removeSection(idx) {
    const next = sections.filter((_, i) => i !== idx);

    setSections(next);
    setSelectedIdx(Math.max(0, Math.min(idx, next.length - 1)));
  }

  function moveSection(from, to) {
    const next = move(sections, from, to);

    setSections(next);
    setSelectedIdx(to);
  }

  function toggleSectionVisibility(idx) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === idx ? { ...section, hidden: !section.hidden } : section
      )
    );
  }

  function updateSelectedProp(key, value) {
    setSections((prev) => updateProp(prev, selectedIdx, key, value));
  }

  async function save(status, refreshPreview = true) {
    setSaving(true);

    try {
      const res = await apiFetch(`/admin/brand-unique-pages/${pageId}/content`, {
        method: "PUT",
        body: {
          content,
          status: status || "DRAFT",
        },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("uniqueBuilderSaveFailed"));
      }

      if (refreshPreview) {
        setPreviewVersion(Date.now());
      }

      alert(
        status === "PUBLISHED"
          ? t("uniqueBuilderPublishedSuccess")
          : t("uniqueBuilderDraftSaved")
      );
    } catch (e) {
      alert(e?.message || t("uniqueBuilderSaveFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function refreshPreview() {
    await save("DRAFT", true);
  }

  if (loading) {
    return <div className="p-8 text-zinc-500">{t("uniqueBuilderLoading")}</div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f6f2fb] text-zinc-900">
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-10 px-4 rounded-xl bg-zinc-900 text-white text-sm font-black"
          >
            {t("uniqueBuilderBackAdmin")}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/brand-unique-pages/${brandId}`)}
            className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-sm font-black"
          >
            {t("uniqueBuilderBackPages")}
          </button>

          <div>
            <div className="text-xs text-zinc-400">
              {t("uniqueBuilderTitle")}
            </div>

            <h1 className="text-base font-black">
              {page?.brandName || brandSlug} / {page?.title || pageSlug}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOnly((v) => !v)}
            className="h-10 px-5 rounded-xl border border-zinc-200 bg-white text-sm font-black"
          >
            {previewOnly
              ? t("uniqueBuilderShowPanels")
              : t("uniqueBuilderPreviewOnly")}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={refreshPreview}
            className="h-10 px-5 rounded-xl bg-white border border-zinc-200 text-sm font-black disabled:opacity-50"
          >
            {t("uniqueBuilderRefreshPreview")}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => save("DRAFT")}
            className="h-10 px-5 rounded-xl bg-zinc-900 text-white text-sm font-black disabled:opacity-50"
          >
            {saving ? t("uniqueBuilderSaving") : t("uniqueBuilderSaveDraft")}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => save("PUBLISHED")}
            className="h-10 px-5 rounded-xl bg-violet-600 text-white text-sm font-black disabled:opacity-50"
          >
            {saving ? t("uniqueBuilderSaving") : t("uniqueBuilderPublish")}
          </button>
        </div>
      </header>

      {!previewOnly ? (
        <div className="h-20 border-b border-zinc-200 bg-white px-6 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-black uppercase text-zinc-400 shrink-0">
            {t("uniqueBuilderAddSection")}
          </span>

          {Object.keys(SECTION_LIBRARY).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => addSection(type)}
              className="h-10 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-black hover:bg-violet-50 hover:text-violet-700"
            >
              + {getSectionLabel(type, t)}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={
          previewOnly
            ? "h-[calc(100vh-64px)] grid grid-cols-1"
            : "h-[calc(100vh-144px)] grid grid-cols-[320px_1fr_420px]"
        }
      >
        {!previewOnly ? (
          <aside className="border-r border-zinc-200 bg-white overflow-auto p-4">
            <div className="mb-4 text-xs font-black uppercase text-zinc-400">
              {t("uniqueBuilderPageSections")}
            </div>

            <div className="space-y-2">
              {sections.map((section, idx) => {
                const active = idx === selectedIdx;

                return (
                  <div
                    key={section.id || idx}
                    onClick={() => selectSection(idx)}
                    className={[
                      "rounded-2xl border p-3 cursor-pointer transition",
                      active
                        ? "border-violet-600 bg-violet-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50",
                      section.hidden ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-black">
                          {idx + 1}. {getSectionLabel(section.type, t)}
                          {section.hidden ? (
                            <span className="ml-2 text-xs text-red-500">
                              {t("uniqueBuilderHidden")}
                            </span>
                          ) : null}
                        </div>

                        <div className="text-[11px] font-mono text-zinc-400">
                          {section.type}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(idx, idx - 1);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                        >
                          <MIcon
                            name="keyboard_arrow_up"
                            className="text-[18px]"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(idx, idx + 1);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                        >
                          <MIcon
                            name="keyboard_arrow_down"
                            className="text-[18px]"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionVisibility(idx);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                        >
                          <MIcon
                            name={
                              section.hidden ? "visibility_off" : "visibility"
                            }
                            className="text-[18px]"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSection(idx);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <MIcon name="delete" className="text-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!sections.length ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
                  {t("uniqueBuilderNoSections")}
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}

        <main className="overflow-hidden bg-zinc-100">
         {previewUrl ? (
  <iframe
    key={previewUrl}
    title="Brand Preview"
    src={previewUrl}
    className="h-full w-full border-0 bg-white"
  />
) : (
  <div className="h-full w-full flex items-center justify-center bg-white text-center px-6">
    <div>
      <div className="text-lg font-black text-red-600">
        Website URL missing
      </div>
      <div className="mt-2 text-sm text-zinc-500">
        Please add website_url in brands table for this brand.
      </div>
    </div>
  </div>
)}
        </main>

        {!previewOnly ? (
          <aside className="border-l border-zinc-200 bg-white overflow-hidden flex flex-col">
            <div className="border-b border-zinc-200 p-5">
              <div className="text-xs text-zinc-400">
                {t("uniqueBuilderEditSelected")}
              </div>

              <h2 className="text-xl font-black">
                {selected ? getSectionLabel(selected.type, t) : t("uniqueBuilderNone")}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {selected ? (
                <GenericEditor
                  t={t}
                  section={selected}
                  onChange={updateSelectedProp}
                />
              ) : (
                <div className="text-sm text-zinc-500">
                  {t("uniqueBuilderSelectSection")}
                </div>
              )}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}