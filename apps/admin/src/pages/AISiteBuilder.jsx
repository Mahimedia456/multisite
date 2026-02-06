// admin/src/pages/AISiteBuilder.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div
      className={[
        "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
        isUser
          ? "ml-auto bg-white border border-zinc-200"
          : "bg-zinc-900 text-white",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function BrandItem({ brand, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border px-3 py-3 transition",
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white hover:border-zinc-300",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-black">{brand.name}</div>
        <span className="text-[11px] font-bold opacity-80">
          {brand.status || "active"}
        </span>
      </div>
      <div className="mt-1 text-xs opacity-80">
        <span className="font-mono">{brand.slug}</span> •{" "}
        <span className="font-mono">{brand.route}</span>
      </div>
    </button>
  );
}

// ✅ handle BOTH cases:
// - apiFetch returns JSON
// - apiFetch returns fetch Response
async function safeApiJson(maybeRes) {
  try {
    if (!maybeRes) return {};
    if (typeof maybeRes.json === "function") {
      return await maybeRes.json().catch(() => ({}));
    }
    return maybeRes;
  } catch {
    return {};
  }
}

function normalizeBrandsPayload(json) {
  // Accept multiple shapes safely:
  // 1) { ok:true, data:[...] }
  // 2) { data:[...] }
  // 3) [...] (array directly)
  const arr = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.rows)
    ? json.rows
    : [];

  return arr.map((b) => {
    const route = b.route || b.brand_route || "";
    const slug = b.slug || String(route || "").replace("/", "") || "";

    // server currently returns camelCase keys (accentColor, etc) in /api/brands,
    // but we also accept snake_case if you later change server.
    return {
      ...b,
      route,
      slug,
      reference_image_url:
        b.reference_image_url || b.referenceImageUrl || b.referenceImage || null,
    };
  });
}

export default function AISiteBuilder() {
  const location = useLocation();
  const prefill = location.state || {};
  const prefillAppliedRef = useRef(false);

  const [brands, setBrands] = useState([]);
  const [q, setQ] = useState("");
  const [loadingBrands, setLoadingBrands] = useState(false);

  const [selected, setSelected] = useState(null);

  const [referenceImageUrl, setReferenceImageUrl] = useState(
    prefill.referenceImageUrl || null
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Left side se brand select karo. Phir prompt do. Build button dabao to backend scripts run hongi.",
    },
  ]);

  const [text, setText] = useState(prefill.initialPrompt || "");
  const [sending, setSending] = useState(false);

  // ✅ Jobs + Logs
  const [lastJob, setLastJob] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [jobLogs, setJobLogs] = useState([]);
  const [polling, setPolling] = useState(false);

  function push(role, t) {
    setMessages((m) => [...m, { role, text: t }]);
  }

  async function loadBrands() {
    setLoadingBrands(true);
    try {
      const maybeRes = await apiFetch(
        `/api/brands?status=all&q=${encodeURIComponent(q)}`
      );

      const json = await safeApiJson(maybeRes);

      if (json?.ok === false) {
        push("assistant", `❌ Brands API error: ${json?.message || "Failed"}`);
        setBrands([]);
        return;
      }

      const normalized = normalizeBrandsPayload(json);
      setBrands(normalized);

      // ✅ Auto-select newly created brand only once
      if (!prefillAppliedRef.current && prefill?.brandId) {
        const found = normalized.find(
          (x) => String(x.id) === String(prefill.brandId)
        );

        if (found) {
          setSelected(found);

          const nextRef =
            prefill.referenceImageUrl ||
            found.reference_image_url ||
            found.referenceImageUrl ||
            null;

          setReferenceImageUrl(nextRef);

          if (prefill.initialPrompt) setText(prefill.initialPrompt);

          push("assistant", `✅ Auto-selected: ${found.name} (${found.slug})`);
        } else {
          push(
            "assistant",
            "⚠️ New brand list me abhi show nahi hua. Refresh dabao."
          );
        }

        prefillAppliedRef.current = true;
      }

      // ✅ If NOTHING returned, show debug hint
      if (!normalized.length) {
        push(
          "assistant",
          "⚠️ No brands received. (Possibly token missing / 401). Network tab me /api/brands response check karo."
        );
      }
    } catch (e) {
      console.error(e);
      push("assistant", "❌ Brands load failed. Console/Network check karo.");
    } finally {
      setLoadingBrands(false);
    }
  }

  useEffect(() => {
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Poll job logs/status
  useEffect(() => {
    if (!jobId || !polling) return;

    let alive = true;

    const tick = async () => {
      try {
        const maybeRes = await apiFetch(`/admin/ai/jobs/${jobId}`, {
          method: "GET",
        });
        const json = await safeApiJson(maybeRes);

        if (!alive) return;
        if (json?.ok === false) return;

        const data = json?.data;
        if (!data) return;

        setJobStatus(data.status || null);
        setJobLogs(Array.isArray(data.logs) ? data.logs : []);

        if (data.status === "done" || data.status === "failed") {
          setPolling(false);
          push("assistant", `✅ Job ${data.status}: ${jobId}`);
        }
      } catch (e) {
        // keep trying
        console.error(e);
      }
    };

    tick();
    const t = setInterval(tick, 1200);

    return () => {
      alive = false;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, polling]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return brands;
    return brands.filter((b) => {
      return (
        String(b.name || "").toLowerCase().includes(qq) ||
        String(b.slug || "").toLowerCase().includes(qq) ||
        String(b.route || "").toLowerCase().includes(qq)
      );
    });
  }, [brands, q]);

  function onSelectBrand(b) {
    setSelected(b);

    const nextRef =
      b?.reference_image_url ||
      b?.referenceImageUrl ||
      prefill.referenceImageUrl ||
      null;

    setReferenceImageUrl(nextRef);

    push("assistant", `Selected: ${b.name} (${b.slug || b.route})`);
    if (nextRef) push("assistant", "✅ Reference UI image ready for prompt.");
  }

  async function send(messageText) {
    if (!selected) {
      push("assistant", "Pehle brand select karo 🙂");
      return;
    }

    const msg = String(messageText || "").trim();
    if (!msg) return;

    setSending(true);
    push("user", msg);

    try {
      const maybeRes = await apiFetch(`/admin/ai/build-site`, {
        method: "POST",
        body: {
          brandId: selected.id,
          message: msg,
          options: { framework: "vite-react", tailwind: true },
        },
      });

      const json = await safeApiJson(maybeRes);

      if (json?.ok === false) {
        push("assistant", `❌ Build API error: ${json?.message || "Failed"}`);
        return;
      }

      setLastJob(json);

      if (json?.jobId) {
        setJobId(json.jobId);
        setJobStatus("running");
        setJobLogs([]);
        setPolling(true);
      }

      push(
        "assistant",
        `✅ Build started. ${json?.jobId ? `jobId: ${json.jobId}` : ""}`
      );
    } catch (e) {
      console.error(e);
      push("assistant", `❌ Build trigger failed: ${e?.message || "Failed"}`);
    } finally {
      setSending(false);
      setText("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">AI Site Builder</h1>
          <p className="text-sm text-zinc-500">
            Brand select karo → prompt do → Build → backend scripts run hongi.
          </p>
        </div>

        <a
          href="/brands"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-bold"
        >
          <MIcon name="arrow_back" />
          Back
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* LEFT */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-extrabold">Brands</div>
            <button
              onClick={loadBrands}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold"
            >
              {loadingBrands ? "Loading..." : "Refresh"}
            </button>
          </div>

          <input
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
            placeholder="Search brand..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="mt-3 h-[520px] overflow-auto space-y-2">
            {filtered.map((b) => (
              <BrandItem
                key={b.id}
                brand={b}
                active={selected?.id === b.id}
                onClick={() => onSelectBrand(b)}
              />
            ))}

            {!filtered.length ? (
              <div className="text-sm text-zinc-500">No brands found.</div>
            ) : null}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-extrabold">
              Chat {selected ? `• ${selected.name}` : ""}
            </div>
            <div className="text-xs text-zinc-500">
              {selected ? `route: ${selected.route}` : "No brand selected"}
            </div>
          </div>

          {/* Reference Image Preview */}
          {referenceImageUrl ? (
            <div className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-black text-zinc-700">
                  Reference UI Image
                </div>
                <button
                  onClick={() => setReferenceImageUrl(null)}
                  className="text-[11px] font-bold text-zinc-600 underline"
                >
                  remove
                </button>
              </div>

              <div className="mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <img
                  src={referenceImageUrl}
                  alt="Reference UI"
                  className="h-40 w-full object-cover"
                />
              </div>

              <div className="mt-2 text-[11px] text-zinc-500 break-all">
                {referenceImageUrl}
              </div>
            </div>
          ) : null}

          <div className="h-[420px] overflow-auto rounded-xl bg-zinc-50 p-3">
            <div className="space-y-3">
              {messages.map((m, idx) => (
                <Bubble key={idx} role={m.role} text={m.text} />
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <textarea
              className="min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
              placeholder='Type prompt... (e.g. "is brand ka react project bana do")'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              disabled={sending}
              onClick={() => send(text)}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black",
                sending ? "bg-zinc-200 text-zinc-500" : "bg-zinc-900 text-white",
              ].join(" ")}
            >
              <MIcon name="send" />
              {sending ? "Sending..." : "Send"}
            </button>

            <button
              disabled={sending || !selected}
              onClick={() => {
                const project = selected?.slug || "brand-site";
                const brandName = selected?.name || "Brand";
                const imgLine = referenceImageUrl
                  ? `Reference UI image URL: ${referenceImageUrl}`
                  : "No reference UI image provided.";

                send(
                  `Create a new React + Tailwind (v3) Vite project for ${brandName}.
Project folder name: ${project}

Commands:
npm create vite@latest ${project} -- --template react
cd ${project}
npm i
npm i -D tailwindcss@3.4.10 postcss autoprefixer
npx tailwindcss init -p

Then:
- Setup Tailwind in index.css and tailwind.config.js
- Generate theme-based folders/components
- Build a complete Home page (hero, sections, CTA)
- Use brand colors where possible
- ${imgLine}`
                );
              }}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black",
                sending || !selected
                  ? "bg-zinc-200 text-zinc-500"
                  : "bg-emerald-600 text-white",
              ].join(" ")}
            >
              <MIcon name="rocket_launch" />
              Build
            </button>
          </div>

          {/* ✅ Live logs panel (polls /admin/ai/jobs/:jobId) */}
          {jobId ? (
            <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-black text-zinc-900">
                  Build Logs {jobStatus ? `• ${jobStatus}` : ""}
                </div>
                <div className="text-xs text-zinc-500 font-mono">{jobId}</div>
              </div>

              {jobStatus === "running" ? (
                <div className="mt-2 text-xs text-zinc-600">
                  ⏳ Script running... terminal me bhi logs aa rahe honge.
                </div>
              ) : null}

              <div className="mt-3 h-48 overflow-auto rounded-xl bg-zinc-50 border border-zinc-200 p-2 text-xs font-mono whitespace-pre-wrap">
                {jobLogs && jobLogs.length ? jobLogs.join("\n") : "No logs yet..."}
              </div>
            </div>
          ) : null}

          {lastJob ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <div className="font-black text-emerald-800">Last Response</div>
              <div className="mt-1 text-emerald-900">
                {lastJob?.jobId ? (
                  <div>
                    jobId: <span className="font-mono">{lastJob.jobId}</span>
                  </div>
                ) : null}
                <div className="text-xs text-emerald-900/80">
                  Console me response check kar lo.
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
