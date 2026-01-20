import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";

const TEMPLATE_DATA = {
  home: {
    name: "Home Page",
    status: "published",
    sections: [
      { id: "hero", type: "Hero", title: "Built on trust", subtitle: "Focused on what matters." },
      { id: "features", type: "Features", items: ["Fast claims", "24/7 support", "Flexible plans"] },
      { id: "cta", type: "CTA", title: "Get a Quote", buttonText: "Start Now" },
    ],
  },
  about: {
    name: "About Us",
    status: "draft",
    sections: [
      { id: "hero", type: "Hero", title: "Founded with purpose", subtitle: "Modern protection through clarity." },
      { id: "mission", type: "Mission", title: "Our Mission", subtitle: "Empower families through transparent insurance." },
    ],
  },
};

function Badge({ text }) {
  const tone = text === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700";
  return <span className={["px-2.5 py-1 rounded-full text-[11px] font-bold uppercase", tone].join(" ")}>{text}</span>;
}

export default function TemplateBuilder() {
  const { brandId, templateId } = useParams();
  const navigate = useNavigate();

  const template = useMemo(() => TEMPLATE_DATA[templateId] || TEMPLATE_DATA.home, [templateId]);

  const [data, setData] = useState(template);

  function updateSectionTitle(sectionId, next) {
    setData((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === sectionId ? { ...s, title: next } : s)),
    }));
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Builder header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-zinc-400">
            Brands <span className="mx-2">›</span> {brandId} <span className="mx-2">›</span> Templates
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-extrabold text-zinc-900">{data.name}</h1>
            <Badge text={data.status} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/brands/${brandId}`)}
            className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>

          <button className="h-11 px-5 rounded-xl bg-zinc-900 text-white text-sm font-extrabold hover:bg-zinc-800">
            Save Changes
          </button>

          <button className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90">
            Publish
          </button>
        </div>
      </div>

      {/* Builder layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6">
        {/* Left: sections list */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200">
            <div className="text-sm font-extrabold text-zinc-900">Sections</div>
            <div className="text-xs text-zinc-500">Edit content blocks for this template.</div>
          </div>

          <div className="p-5 space-y-3">
            {data.sections.map((s) => (
              <div key={s.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">
                    {s.type}
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <button className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center">
                      <MIcon name="keyboard_arrow_up" className="text-[18px]" />
                    </button>
                    <button className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center">
                      <MIcon name="keyboard_arrow_down" className="text-[18px]" />
                    </button>
                    <button className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center">
                      <MIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </div>

                {"title" in s && (
                  <div className="mt-3">
                    <label className="text-xs font-bold text-zinc-500">Title</label>
                    <input
                      value={s.title}
                      onChange={(e) => updateSectionTitle(s.id, e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                {"subtitle" in s && (
                  <div className="mt-3">
                    <label className="text-xs font-bold text-zinc-500">Subtitle</label>
                    <input
                      value={s.subtitle}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          sections: d.sections.map((x) =>
                            x.id === s.id ? { ...x, subtitle: e.target.value } : x
                          ),
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}
              </div>
            ))}

            <button className="w-full h-11 rounded-2xl bg-primary/10 text-primary font-extrabold hover:bg-primary/15 transition flex items-center justify-center gap-2">
              <MIcon name="add" className="text-[18px]" />
              Add Section
            </button>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-zinc-900">Live Preview</div>
              <div className="text-xs text-zinc-500">Mock preview (wireframe)</div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600">
                <MIcon name="desktop_windows" className="text-[20px]" />
              </button>
              <button className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600">
                <MIcon name="smartphone" className="text-[20px]" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-zinc-50 min-h-[640px]">
            <div className="max-w-[900px] mx-auto space-y-6">
              {data.sections.map((s) => (
                <div key={s.id} className="rounded-3xl bg-white border border-zinc-200 p-7">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">
                    {s.type}
                  </div>
                  {"title" in s && <div className="mt-2 text-2xl font-extrabold text-zinc-900">{s.title}</div>}
                  {"subtitle" in s && <div className="mt-2 text-sm text-zinc-600">{s.subtitle}</div>}

                  {"items" in s && (
                    <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
