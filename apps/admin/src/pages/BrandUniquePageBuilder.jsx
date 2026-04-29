import { useEffect, useMemo, useState } from "react";
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
    label: "Hero",
    defaults: {
      badge: "Reliable Insurance Solutions",
      headline: "Protect what matters most with trusted coverage",
      subheading:
        "From health and life to vehicle and property insurance, DropBrand makes coverage simple, transparent, and built around your future.",
      image: IMG_1,
      ctaLabel: "Get Free Quote",
      ctaHref: "/contact",
    },
  },
  AboutSection: {
    label: "About",
    defaults: {
      eyebrow: "About us",
      headline: "Protecting lives, assets and futures with confidence",
      body:
        "We provide reliable insurance solutions designed to safeguard individuals, families, and businesses with clear guidance, honest coverage, and dependable support.",
      image1: IMG_2,
      image2: IMG_3,
      quote:
        "Insurance is not just about policies. It is about protecting people, dreams, and the future they are building.",
      stat1Value: "80+",
      stat1Label: "Industry awards",
      stat2Value: "1M+",
      stat2Label: "Customer interactions",
    },
  },
  ServicesSection: {
    label: "Services",
    defaults: {
      eyebrow: "Our services",
      headline: "Insurance service that keeps you protected and confident",
      ctaLabel: "View all services",
      items: [
        { title: "Life Insurance", desc: "Secure your family’s future.", image: IMG_1 },
        { title: "Health Insurance", desc: "Reliable healthcare support.", image: IMG_2 },
        { title: "Vehicle Insurance", desc: "Drive with confidence.", image: IMG_3 },
      ],
    },
  },
  WhyChooseSection: {
    label: "Why Choose",
    defaults: {
      eyebrow: "Why choose us",
      headline: "Trusted insurance solution backed by experience",
      body:
        "We combine industry expertise, transparent policies, and dedicated support to deliver insurance solutions you can depend on.",
      image: IMG_1,
      items: [
        "Transparent pricing with no hidden fees",
        "Experienced advisors from first consultation",
        "Fast and hassle-free claims process",
        "Flexible plans tailored to your needs",
      ],
    },
  },
  VideoStorySection: {
    label: "Video Story",
    defaults: {
      eyebrow: "Watch our story",
      headline: "Discover the story behind our commitment to protecting",
      image: IMG_1,
    },
  },
  FeaturesSection: {
    label: "Features",
    defaults: {
      eyebrow: "Core features",
      headline: "Key features that set our service apart",
      cardTitle: "Expert Advisor Support",
      cardBody:
        "Our experienced insurance advisors are available to help compare plans and manage coverage.",
      stats1: "98%",
      stats1Label: "Support satisfaction",
      stats2: "500+",
      stats2Label: "Claim resolutions",
      items: [
        "Transparent and easy to understand",
        "Fast and smooth claims process",
        "Secure and reliable service",
      ],
    },
  },
  PricingSection: {
    label: "Pricing",
    defaults: {
      eyebrow: "Pricing plans",
      headline: "Affordable coverage that fits",
      subheading: "Easy-to-understand plans tailored to your needs and budget.",
      plans: [
        { name: "Basic Plan", price: "$49.00", features: ["Fast-track claims", "Life coverage", "Email support"] },
        { name: "Standard Plan", price: "$89.00", features: ["Priority claims", "Advisor support", "Vehicle add-on"] },
        { name: "Premium Plan", price: "$149.00", features: ["Full protection", "24/7 support", "Business coverage"] },
      ],
    },
  },
  ContactSection: {
    label: "Contact",
    defaults: {
      eyebrow: "Contact us today",
      headline: "Have questions? Connect with us for support",
      subheading:
        "Connect with our experts and experience seamless assistance every step of the way.",
      phone: "+49 000 000 000",
    },
  },
  FAQSection: {
    label: "FAQ",
    defaults: {
      eyebrow: "FAQ",
      headline: "Common questions about our coverage and services",
      subheading:
        "We have answered the most common questions to make insurance decisions easier.",
      items: [
        { q: "How do I choose the right insurance plan?", a: "Our advisors help compare options." },
        { q: "What types of insurance plans do you offer?", a: "We offer life, health, vehicle and property insurance." },
      ],
    },
  },
  TestimonialsSection: {
    label: "Testimonials",
    defaults: {
      eyebrow: "Testimonials",
      headline: "Building trust through real customers",
      image: IMG_1,
      quote:
        "The team took time to understand my needs and explained every option clearly.",
      name: "Robert Fox",
      role: "Small Business Owner",
    },
  },
  BlogSection: {
    label: "Blog",
    defaults: {
      eyebrow: "Latest blogs",
      headline: "Latest news, guides and updates",
      posts: [
        { title: "How to choose the right insurance plan", image: IMG_1 },
        { title: "5 common insurance mistakes to avoid", image: IMG_2 },
        { title: "Health insurance explained simply", image: IMG_3 },
      ],
    },
  },
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
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
  return sections.map((s, i) =>
    i === index ? { ...s, props: { ...(s.props || {}), [key]: value } } : s
  );
}

function PreviewSection({ section }) {
  const p = section?.props || {};

  if (section.type === "HeroSection") {
    return (
      <section className="relative overflow-hidden rounded-[32px] bg-[#07361f] text-white">
        <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#ffb347]">
              {p.badge}
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight">{p.headline}</h1>
            <p className="mt-5 text-white/70">{p.subheading}</p>
            <button className="mt-7 rounded-full bg-[#ffb347] px-6 py-3 text-sm font-black text-[#07361f]">
              {p.ctaLabel}
            </button>
          </div>
          <img src={p.image} className="h-[420px] w-full rounded-[28px] object-cover" />
        </div>
      </section>
    );
  }

  if (section.type === "AboutSection") {
    return (
      <section className="rounded-[32px] bg-white p-10 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src={p.image1} className="h-80 rounded-[28px] object-cover" />
            <img src={p.image2} className="mt-12 h-80 rounded-[28px] object-cover" />
          </div>
          <div>
            <p className="text-sm font-black text-emerald-700">{p.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-black">{p.headline}</h2>
            <p className="mt-4 text-zinc-600">{p.body}</p>
            <div className="mt-6 rounded-3xl bg-zinc-50 p-5 font-bold">{p.quote}</div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-zinc-50 p-5">
                <div className="text-3xl font-black">{p.stat1Value}</div>
                <p className="text-sm text-zinc-500">{p.stat1Label}</p>
              </div>
              <div className="rounded-3xl bg-zinc-50 p-5">
                <div className="text-3xl font-black">{p.stat2Value}</div>
                <p className="text-sm text-zinc-500">{p.stat2Label}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "ServicesSection") {
    return (
      <section className="rounded-[32px] bg-white p-10 shadow-sm">
        <p className="text-sm font-black text-emerald-700">{p.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-black">{p.headline}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(p.items || []).map((it, i) => (
            <div key={i} className="overflow-hidden rounded-3xl bg-zinc-50">
              <img src={it.image} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-black">{it.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] bg-white p-10 shadow-sm">
      <p className="text-sm font-black text-emerald-700">{p.eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black">{p.headline}</h2>
      <p className="mt-4 text-zinc-600">{p.subheading || p.body || p.quote}</p>
      {p.image ? <img src={p.image} className="mt-6 h-80 w-full rounded-3xl object-cover" /> : null}
    </section>
  );
}

function GenericEditor({ section, onChange }) {
  const p = section?.props || {};

  function updateArrayItem(key, idx, field, value) {
    const arr = Array.isArray(p[key]) ? [...p[key]] : [];
    arr[idx] = { ...(arr[idx] || {}), [field]: value };
    onChange(key, arr);
  }

  function removeArrayItem(key, idx) {
    const arr = Array.isArray(p[key]) ? [...p[key]] : [];
    onChange(key, arr.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {Object.entries(p).map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="space-y-3">
              <div className="text-xs font-black uppercase text-zinc-500">{key}</div>
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
                      <button onClick={() => removeArrayItem(key, idx)} className="text-red-600">
                        <MIcon name="delete" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="rounded-2xl border border-zinc-200 p-3 space-y-3">
                    {Object.entries(item || {}).map(([field, fieldValue]) => (
                      <TextInput
                        key={field}
                        label={field}
                        value={fieldValue}
                        onChange={(v) => updateArrayItem(key, idx, field, v)}
                      />
                    ))}
                    <button
                      onClick={() => removeArrayItem(key, idx)}
                      className="text-xs font-bold text-red-600"
                    >
                      Remove item
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  const arr = Array.isArray(value) ? [...value] : [];
                  const sample = arr[0];
                  if (typeof sample === "string") arr.push("New item");
                  else arr.push({ title: "New title", desc: "Description", image: IMG_1 });
                  onChange(key, arr);
                }}
                className="rounded-xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-700"
              >
                + Add {key}
              </button>
            </div>
          );
        }

        if (String(key).toLowerCase().includes("body") || String(key).toLowerCase().includes("subheading") || String(key).toLowerCase().includes("quote")) {
          return <TextArea key={key} label={key} value={value} onChange={(v) => onChange(key, v)} />;
        }

        return <TextInput key={key} label={key} value={value} onChange={(v) => onChange(key, v)} />;
      })}
    </div>
  );
}

export default function BrandUniquePageBuilder() {
  const { brandId, pageId } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selected = sections[selectedIdx] || null;

  const content = useMemo(
    () => ({
      templateKey: "dropbrand-home-builder",
      sections,
    }),
    [sections]
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const res = await apiFetch(`/admin/brand-unique-pages/${pageId}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load page");

        const latest = json.data?.latestVersion?.content;
        const nextSections = Array.isArray(latest?.sections) ? latest.sections : [];

        if (alive) {
          setPage(json.data?.page);
          setSections(nextSections);
          setSelectedIdx(0);
        }
      } catch (e) {
        alert(e?.message || "Failed to load builder");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [pageId]);

  function addSection(type) {
    const def = SECTION_LIBRARY[type];
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

  function updateSelectedProp(key, value) {
    setSections((prev) => updateProp(prev, selectedIdx, key, value));
  }

  async function save(status) {
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
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Save failed");

      alert(status === "PUBLISHED" ? "Published successfully" : "Draft saved");
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-zinc-500">Loading builder...</div>;

  return (
    <div className="h-[calc(100vh-40px)] max-w-[1900px] mx-auto grid grid-cols-[330px,1fr,390px] gap-4 p-4">
      <aside className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-5">
          <button
            onClick={() => navigate(`/brand-unique-pages/${brandId}`)}
            className="mb-3 text-xs font-bold text-violet-700"
          >
            ← Back to pages
          </button>
          <div className="text-xs text-zinc-400">Brand Unique Page Builder</div>
          <h1 className="text-lg font-black text-zinc-900">
            {page?.brandName} / {page?.title || page?.slug}
          </h1>
        </div>

        <div className="border-b border-zinc-200 p-4">
          <div className="text-xs font-black text-zinc-500 mb-3">Add Section</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(SECTION_LIBRARY).map((type) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-black hover:bg-violet-50 hover:text-violet-700"
              >
                + {SECTION_LIBRARY[type].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[calc(100%-245px)] overflow-auto p-3 space-y-2">
          {sections.map((s, idx) => {
            const active = idx === selectedIdx;
            return (
              <div
                key={s.id || idx}
                onClick={() => setSelectedIdx(idx)}
                className={[
                  "rounded-2xl border p-3 cursor-pointer",
                  active ? "border-violet-600 bg-violet-50" : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-black text-zinc-900">
                      {idx + 1}. {SECTION_LIBRARY[s.type]?.label || s.type}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">{s.type}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(idx, idx - 1);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                    >
                      <MIcon name="keyboard_arrow_up" className="text-[18px]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(idx, idx + 1);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                    >
                      <MIcon name="keyboard_arrow_down" className="text-[18px]" />
                    </button>
                    <button
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
              No sections yet. Add sections above.
            </div>
          ) : null}
        </div>
      </aside>

      <main className="overflow-auto rounded-3xl border border-zinc-200 bg-zinc-100 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {sections.map((s) => (
            <PreviewSection key={s.id} section={s} />
          ))}
          {!sections.length ? (
            <div className="rounded-3xl bg-white p-20 text-center text-zinc-500">
              Add sections to preview home page.
            </div>
          ) : null}
        </div>
      </main>

      <aside className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-5">
          <div className="text-xs text-zinc-400">Edit Selected Section</div>
          <h2 className="text-lg font-black">
            {selected ? SECTION_LIBRARY[selected.type]?.label || selected.type : "None"}
          </h2>
        </div>

        <div className="h-[calc(100%-155px)] overflow-auto p-5">
          {selected ? (
            <GenericEditor section={selected} onChange={updateSelectedProp} />
          ) : (
            <div className="text-sm text-zinc-500">Select a section to edit.</div>
          )}
        </div>

        <div className="border-t border-zinc-200 p-4 flex justify-end gap-2">
          <button
            disabled={saving}
            onClick={() => save("DRAFT")}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            disabled={saving}
            onClick={() => save("PUBLISHED")}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </aside>
    </div>
  );
}