import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

const SECTION_LIBRARY = {
  Hero: {
    label: "Hero Section",
    defaults: {
      badge: "Reliable Insurance Solutions",
      headline: "Protect what matters most with trusted coverage",
      subheading:
        "From health and life to vehicle and property insurance, we make it easy to find the right coverage.",
      image: "",
      primaryCta: { label: "Get Free Quote", href: "/contact" },
    },
  },
  About: {
    label: "About Section",
    defaults: {
      eyebrow: "About Us",
      headline: "Protecting lives, assets and futures with confidence",
      body:
        "We provide reliable insurance solutions designed to safeguard individuals, families, and businesses.",
      stat1Value: "80+",
      stat1Label: "Industry awards",
      stat2Value: "1M+",
      stat2Label: "Customers supported",
    },
  },
  Services: {
    label: "Services Section",
    defaults: {
      eyebrow: "Our Services",
      headline: "Insurance service that keeps you protected and confident",
      items: [
        { title: "Life Insurance", desc: "Secure your family's future." },
        { title: "Health Insurance", desc: "Access reliable healthcare support." },
        { title: "Vehicle Insurance", desc: "Drive with confidence." },
      ],
    },
  },
  FAQ: {
    label: "FAQ Section",
    defaults: {
      eyebrow: "FAQ",
      headline: "Common questions about our coverage",
      items: [
        { q: "How do I choose the right plan?", a: "Our advisors help compare options." },
        { q: "Can I change my policy later?", a: "Yes, your policy can be adjusted." },
      ],
    },
  },
  CTA: {
    label: "CTA Section",
    defaults: {
      headline: "Have questions? Connect with us for support",
      subheading: "Our team is ready to help you choose the right coverage.",
      cta: { label: "Contact Us", href: "/contact" },
    },
  },
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function move(arr, from, to) {
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
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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

  if (section.type === "Hero") {
    return (
      <section className="rounded-[32px] bg-[#07361f] p-10 text-white">
        <p className="text-sm font-black text-[#ffb347]">{p.badge}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight">
          {p.headline}
        </h1>
        <p className="mt-5 max-w-2xl text-white/70">{p.subheading}</p>
        <button className="mt-7 rounded-full bg-[#ffb347] px-6 py-3 text-sm font-black text-[#07361f]">
          {p.primaryCta?.label || "Get Quote"}
        </button>
      </section>
    );
  }

  if (section.type === "About") {
    return (
      <section className="rounded-[32px] bg-white p-10 shadow-sm">
        <p className="text-sm font-black text-primary">{p.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-black">{p.headline}</h2>
        <p className="mt-4 text-zinc-600">{p.body}</p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-zinc-50 p-5">
            <div className="text-3xl font-black">{p.stat1Value}</div>
            <p className="text-sm text-zinc-500">{p.stat1Label}</p>
          </div>
          <div className="rounded-3xl bg-zinc-50 p-5">
            <div className="text-3xl font-black">{p.stat2Value}</div>
            <p className="text-sm text-zinc-500">{p.stat2Label}</p>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "Services") {
    return (
      <section className="rounded-[32px] bg-white p-10 shadow-sm">
        <p className="text-sm font-black text-primary">{p.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-black">{p.headline}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {(p.items || []).map((it, i) => (
            <div key={i} className="rounded-3xl bg-zinc-50 p-5">
              <h3 className="font-black">{it.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "FAQ") {
    return (
      <section className="rounded-[32px] bg-white p-10 shadow-sm">
        <p className="text-sm font-black text-primary">{p.eyebrow}</p>
        <h2 className="mt-3 text-4xl font-black">{p.headline}</h2>
        <div className="mt-8 space-y-3">
          {(p.items || []).map((it, i) => (
            <div key={i} className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="font-black">{it.q}</h3>
              <p className="mt-2 text-sm text-zinc-600">{it.a}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "CTA") {
    return (
      <section className="rounded-[32px] bg-[#07361f] p-10 text-white">
        <h2 className="text-4xl font-black">{p.headline}</h2>
        <p className="mt-4 text-white/70">{p.subheading}</p>
        <button className="mt-7 rounded-full bg-[#ffb347] px-6 py-3 text-sm font-black text-[#07361f]">
          {p.cta?.label || "Contact"}
        </button>
      </section>
    );
  }

  return null;
}

function SectionEditor({ section, onChange }) {
  const p = section?.props || {};

  if (!section) {
    return <div className="text-sm text-zinc-500">Select a section to edit.</div>;
  }

  if (section.type === "Hero") {
    return (
      <div className="space-y-4">
        <TextInput label="Badge" value={p.badge} onChange={(v) => onChange("badge", v)} />
        <TextInput label="Headline" value={p.headline} onChange={(v) => onChange("headline", v)} />
        <TextArea label="Subheading" value={p.subheading} onChange={(v) => onChange("subheading", v)} />
        <TextInput
          label="CTA Label"
          value={p.primaryCta?.label}
          onChange={(v) => onChange("primaryCta", { ...(p.primaryCta || {}), label: v })}
        />
        <TextInput
          label="CTA Link"
          value={p.primaryCta?.href}
          onChange={(v) => onChange("primaryCta", { ...(p.primaryCta || {}), href: v })}
        />
        <TextInput label="Image URL" value={p.image} onChange={(v) => onChange("image", v)} />
      </div>
    );
  }

  if (section.type === "About") {
    return (
      <div className="space-y-4">
        <TextInput label="Eyebrow" value={p.eyebrow} onChange={(v) => onChange("eyebrow", v)} />
        <TextInput label="Headline" value={p.headline} onChange={(v) => onChange("headline", v)} />
        <TextArea label="Body" value={p.body} onChange={(v) => onChange("body", v)} />
        <TextInput label="Stat 1 Value" value={p.stat1Value} onChange={(v) => onChange("stat1Value", v)} />
        <TextInput label="Stat 1 Label" value={p.stat1Label} onChange={(v) => onChange("stat1Label", v)} />
        <TextInput label="Stat 2 Value" value={p.stat2Value} onChange={(v) => onChange("stat2Value", v)} />
        <TextInput label="Stat 2 Label" value={p.stat2Label} onChange={(v) => onChange("stat2Label", v)} />
      </div>
    );
  }

  if (section.type === "Services" || section.type === "FAQ") {
    const isFaq = section.type === "FAQ";
    const items = Array.isArray(p.items) ? p.items : [];

    return (
      <div className="space-y-4">
        <TextInput label="Eyebrow" value={p.eyebrow} onChange={(v) => onChange("eyebrow", v)} />
        <TextInput label="Headline" value={p.headline} onChange={(v) => onChange("headline", v)} />

        <div className="space-y-3">
          <div className="text-xs font-black text-zinc-500">Items</div>

          {items.map((it, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-3 space-y-3">
              <TextInput
                label={isFaq ? "Question" : "Title"}
                value={isFaq ? it.q : it.title}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = isFaq ? { ...it, q: v } : { ...it, title: v };
                  onChange("items", next);
                }}
              />
              <TextArea
                label={isFaq ? "Answer" : "Description"}
                value={isFaq ? it.a : it.desc}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = isFaq ? { ...it, a: v } : { ...it, desc: v };
                  onChange("items", next);
                }}
              />
              <button
                onClick={() => onChange("items", items.filter((_, i) => i !== idx))}
                className="text-xs font-bold text-red-600"
              >
                Remove item
              </button>
            </div>
          ))}

          <button
            onClick={() =>
              onChange("items", [
                ...items,
                isFaq ? { q: "New question", a: "New answer" } : { title: "New service", desc: "Description" },
              ])
            }
            className="h-10 rounded-xl bg-primary/10 px-4 text-xs font-black text-primary"
          >
            + Add Item
          </button>
        </div>
      </div>
    );
  }

  if (section.type === "CTA") {
    return (
      <div className="space-y-4">
        <TextInput label="Headline" value={p.headline} onChange={(v) => onChange("headline", v)} />
        <TextArea label="Subheading" value={p.subheading} onChange={(v) => onChange("subheading", v)} />
        <TextInput
          label="CTA Label"
          value={p.cta?.label}
          onChange={(v) => onChange("cta", { ...(p.cta || {}), label: v })}
        />
        <TextInput
          label="CTA Link"
          value={p.cta?.href}
          onChange={(v) => onChange("cta", { ...(p.cta || {}), href: v })}
        />
      </div>
    );
  }

  return null;
}

export default function VisualPageBuilder() {
  const { pageId } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selected = sections[selectedIdx] || null;

  const content = useMemo(
    () => ({
      templateKey: "visual-builder",
      sections,
    }),
    [sections]
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const res = await apiFetch(`/admin/shared-pages/${pageId}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load page");

        const latest = json.data?.latestVersion?.content;
        const nextSections = Array.isArray(latest?.sections) ? latest.sections : [];

        if (alive) {
          setPage(json.data);
          setSections(nextSections);
          setSelectedIdx(0);
        }
      } catch (e) {
        alert(e?.message || "Failed to load");
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
        props: JSON.parse(JSON.stringify(def.defaults)),
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
    if (to < 0 || to >= sections.length) return;
    setSections(move(sections, from, to));
    setSelectedIdx(to);
  }

  function updateSelectedProp(key, value) {
    setSections((prev) => updateProp(prev, selectedIdx, key, value));
  }

  async function save(status) {
    setSaving(true);
    try {
      const res = await apiFetch(`/admin/shared-pages/${pageId}/content`, {
        method: "PUT",
        body: {
          content,
          status: status || undefined,
        },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Save failed");

      alert(status ? "Saved & published" : "Saved");
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-zinc-500">Loading builder...</div>;

  return (
    <div className="h-[calc(100vh-40px)] max-w-[1800px] mx-auto grid grid-cols-[320px,1fr,380px] gap-4 p-4">
      {/* LEFT: section manager */}
      <aside className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-5">
          <div className="text-xs text-zinc-400">Visual Builder</div>
          <h1 className="text-lg font-black text-zinc-900">
            {page?.title || page?.slug || "Page"}
          </h1>
        </div>

        <div className="border-b border-zinc-200 p-4">
          <div className="text-xs font-black text-zinc-500 mb-3">Add Section</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(SECTION_LIBRARY).map((type) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-black hover:bg-primary/10 hover:text-primary"
              >
                + {SECTION_LIBRARY[type].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[calc(100%-230px)] overflow-auto p-3 space-y-2">
          {sections.map((s, idx) => {
            const active = idx === selectedIdx;
            return (
              <div
                key={s.id || idx}
                onClick={() => setSelectedIdx(idx)}
                className={[
                  "rounded-2xl border p-3 cursor-pointer",
                  active ? "border-primary bg-primary/10" : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-black text-zinc-900">
                      {idx + 1}. {SECTION_LIBRARY[s.type]?.label || s.type}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">{s.type}</div>
                  </div>

                  {/* ✅ Controls only inside editor UI, not preview */}
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
              No sections yet. Add one above.
            </div>
          ) : null}
        </div>
      </aside>

      {/* CENTER: clean preview only */}
      <main className="overflow-auto rounded-3xl border border-zinc-200 bg-zinc-100 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {sections.map((s) => (
            <PreviewSection key={s.id} section={s} />
          ))}

          {!sections.length ? (
            <div className="rounded-3xl bg-white p-20 text-center text-zinc-500">
              Preview will appear here.
            </div>
          ) : null}
        </div>
      </main>

      {/* RIGHT: props editor */}
      <aside className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400">Edit Section</div>
              <h2 className="text-lg font-black">
                {selected ? SECTION_LIBRARY[selected.type]?.label || selected.type : "None"}
              </h2>
            </div>

            <button
              onClick={() => navigate("/brand-inner-pages")}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-black"
            >
              Back
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-150px)] overflow-auto p-5">
          <SectionEditor section={selected} onChange={updateSelectedProp} />
        </div>

        <div className="border-t border-zinc-200 p-4 flex justify-end gap-2">
          <button
            disabled={saving}
            onClick={() => save()}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
          >
            Save
          </button>
          <button
            disabled={saving}
            onClick={() => save("published")}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-white disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </aside>
    </div>
  );
}