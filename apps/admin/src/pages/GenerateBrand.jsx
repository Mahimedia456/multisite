// src/pages/GenerateBrand.jsx
import { useMemo, useState } from "react";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const KUNDLER_TEMPLATE = {
  status: "active",

  // ✅ IMPORTANT: template brand must stay fixed
  template_slug: "kundler3",

  accent_color: "#2ec2b3",
  primary_color: "#2ec2b3",
  primary_dark_color: "#259c8f",
  accent_color_2: "#fcd34d",
  background_light: "#f6f8f8",
  background_dark: "#131f1e",
  surface_light: "#ffffff",
  surface_dark: "#1c2a29",

  logo_type: "material",
  logo_value: "pets",
  logo_text: "Kundler 3",

  font_family: "Plus Jakarta Sans",
  font_google_url:
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap",
  icon_font_url:
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap",

  typography_json: JSON.stringify({
    family: null,
    iconsUrl: null,
    googleUrl: null,
  }),
  nav_links_json: JSON.stringify([
    { to: "/plans", label: "Plans" },
    { to: "/how-it-works", label: "How it Works" },
    { to: "/claims", label: "Claims" },
  ]),
  cta_json: JSON.stringify({ to: "/quote", label: "Get a Quote" }),
};

function slugify(v) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-zinc-500">{label}</label>
      <input
        type={type}
        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

async function safeJson(res) {
  return await res.json().catch(() => ({}));
}

function pickBrandFromResponse(json) {
  if (json?.brand?.slug) return json.brand;
  if (json?.data?.brand?.slug) return json.data.brand;
  if (json?.slug) return json;
  return null;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read failed"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

export default function GenerateBrand() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Reference UI image upload karo (optional), phir brand details fill karo. Main Kundler template use karke brand create kar dunga.",
    },
  ]);

  const [refImage, setRefImage] = useState(null); // File
  const [uploadedRefUrl, setUploadedRefUrl] = useState(null); // ✅ store uploaded URL
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [route, setRoute] = useState("");
  const [brandDescription, setBrandDescription] = useState("");

  const [primaryColor, setPrimaryColor] = useState("#2ec2b3");
  const [accentColor, setAccentColor] = useState("#2ec2b3");
  const [fontFamily, setFontFamily] = useState("Plus Jakarta Sans");
  const [fontGoogleUrl, setFontGoogleUrl] = useState(
    KUNDLER_TEMPLATE.font_google_url
  );

  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyWhatsapp, setCompanyWhatsapp] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");

  const computedSlug = useMemo(() => slugify(slug || name), [slug, name]);
  const computedRoute = useMemo(
    () => `/${computedSlug || "new-brand"}`,
    [computedSlug]
  );

  function push(role, text) {
    setMessages((m) => [...m, { role, text }]);
  }

  async function uploadReferenceImageIfAny() {
    if (!refImage) return null;

    try {
      push("assistant", "⏫ Uploading reference image...");
      const dataUrl = await fileToDataUrl(refImage);

      const res = await apiFetch(`/admin/upload`, {
        method: "POST",
        body: {
          dataUrl,
          fileName: refImage.name,
          folder: "reference-ui",
        },
      });

      const json = await safeJson(res);

      if (!res.ok || !json?.ok || !json?.url) {
        console.log("UPLOAD RAW:", res, json);
        push("assistant", "⚠️ Upload failed. Skipping image.");
        return null;
      }

      setUploadedRefUrl(json.url); // ✅ store for later
      push("assistant", "✅ Image uploaded.");
      return json.url;
    } catch (e) {
      console.error("uploadReferenceImageIfAny failed:", e);
      push("assistant", "⚠️ Upload failed (CORS/server). Skipping image.");
      return null;
    }
  }

  async function onCreate() {
    setLoading(true);
    setResult(null);

    try {
      push("user", `Create brand: ${name || "(no name)"} (${computedSlug})`);

      // ✅ upload optional
      const refImageUrl = await uploadReferenceImageIfAny();

      // ✅ final URL (upload succeeded OR already stored from earlier attempt)
      const finalRefUrl = refImageUrl || uploadedRefUrl || null;

      const payload = {
        ...KUNDLER_TEMPLATE,
        template_slug: "kundler3",

        name: name || "New Brand",
        slug: computedSlug,
        route: route || computedRoute,
        brand_description: brandDescription || "",

        primary_color: primaryColor || KUNDLER_TEMPLATE.primary_color,
        accent_color: accentColor || KUNDLER_TEMPLATE.accent_color,

        font_family: fontFamily || KUNDLER_TEMPLATE.font_family,
        font_google_url: fontGoogleUrl || KUNDLER_TEMPLATE.font_google_url,

        logo_text: name || KUNDLER_TEMPLATE.logo_text,

        company_name: companyName || "",
        company_phone: companyPhone || "",
        company_whatsapp: companyWhatsapp || "",
        company_email: companyEmail || "",
        company_location: companyLocation || "",

        reference_image_url: finalRefUrl,
      };

      const res = await apiFetch(`/admin/generate-brand`, {
        method: "POST",
        body: payload,
      });

      const json = await safeJson(res);

      if (!res.ok) {
        throw new Error(
          json?.message || json?.error || `Create failed (${res.status})`
        );
      }

      const brand = pickBrandFromResponse(json);

      if (!brand?.id || !brand?.slug) {
        console.log("CREATE BRAND RAW RESPONSE:", json);
        throw new Error("Brand create response invalid (brand.id/slug missing)");
      }

      setResult(brand);
      push(
        "assistant",
        `✅ Brand created. slug: ${brand.slug} route: ${brand.route}`
      );

      // ✅ Redirect AFTER success (ONLY HERE)
      navigate("/admin/ai-site-builder", {
        replace: true,
        state: {
          // brand info
          brandId: brand.id,
          brandSlug: brand.slug,
          brandName: brand.name,
          brandRoute: brand.route,

          // image
          referenceImageUrl: finalRefUrl,

          // auto prompt for builder
          initialPrompt: `Build a React + Tailwind site for "${brand.name}" (slug: ${brand.slug}). Use the reference UI image (if provided) as styling inspiration. Keep header/footer cloned from kundler3. Generate a clean Home page and basic components.`,
        },
      });
    } catch (e) {
      console.error(e);
      push("assistant", `❌ Error: ${e?.message || "Failed"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Generate Brand</h1>
          <p className="text-sm text-zinc-500">
            Kundler template se auto brand create (name/slug/colors/fonts/contact override)
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chat-like panel */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-extrabold">Assistant</div>
            <div className="text-xs text-zinc-500">
              Reference UI + instructions
            </div>
          </div>

          <div className="h-[420px] overflow-auto rounded-xl bg-zinc-50 p-3">
            <div className="space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={[
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto bg-white border border-zinc-200"
                      : "bg-zinc-900 text-white",
                  ].join(" ")}
                >
                  {m.text}
                </div>
              ))}

              {refImage ? (
                <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white p-3">
                  <div className="text-xs font-bold text-zinc-500">
                    Reference Image Selected
                  </div>
                  <div className="mt-2 text-sm">{refImage.name}</div>
                  {uploadedRefUrl ? (
                    <div className="mt-2 text-xs text-emerald-700">
                      ✅ Uploaded URL saved
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-bold">
              <MIcon name="image" />
              Upload Reference UI
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setRefImage(f || null);
                  setUploadedRefUrl(null); // reset on new file
                  if (f) push("user", `Reference image selected: ${f.name}`);
                }}
              />
            </label>

            <button
              onClick={() =>
                push(
                  "assistant",
                  "Ab right side pe details fill karo, phir Create Brand dabao."
                )
              }
              className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-bold text-white"
            >
              Continue
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
            <div className="font-black text-zinc-700">Notes</div>
            <div>• Image upload fail ho to brand create rukega nahi (auto-skip).</div>
            <div>
              • template_slug hamesha{" "}
              <span className="font-mono">kundler3</span> hi rahega.
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 text-sm font-extrabold">Brand Details</div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Brand Name"
              value={name}
              onChange={setName}
              placeholder="e.g. Zeenat Styles"
            />
            <Field
              label="Slug (auto from name)"
              value={slug}
              onChange={setSlug}
              placeholder="e.g. zeenat-styles"
            />

            <Field
              label="Route (optional)"
              value={route}
              onChange={setRoute}
              placeholder={computedRoute}
            />

            <Field
              label="Font Family"
              value={fontFamily}
              onChange={setFontFamily}
              placeholder="Plus Jakarta Sans"
            />

            <Field
              label="Font Google URL"
              value={fontGoogleUrl}
              onChange={setFontGoogleUrl}
              placeholder={KUNDLER_TEMPLATE.font_google_url}
            />

            <Field
              label="Primary Color"
              type="text"
              value={primaryColor}
              onChange={setPrimaryColor}
              placeholder="#2ec2b3"
            />
            <Field
              label="Accent Color"
              type="text"
              value={accentColor}
              onChange={setAccentColor}
              placeholder="#2ec2b3"
            />

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-500">
                Brand Description
              </label>
              <textarea
                className="min-h-[90px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                placeholder="Short brand description..."
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <div className="text-xs font-black text-zinc-700">
                Company / Contact
              </div>
            </div>

            <Field
              label="Company Name"
              value={companyName}
              onChange={setCompanyName}
              placeholder="Company name"
            />
            <Field
              label="Email"
              value={companyEmail}
              onChange={setCompanyEmail}
              placeholder="support@domain.com"
            />
            <Field
              label="Phone"
              value={companyPhone}
              onChange={setCompanyPhone}
              placeholder="+92..."
            />
            <Field
              label="WhatsApp"
              value={companyWhatsapp}
              onChange={setCompanyWhatsapp}
              placeholder="+92..."
            />
            <Field
              label="Location"
              value={companyLocation}
              onChange={setCompanyLocation}
              placeholder="City, Country"
            />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-xs text-zinc-600">
              <div>
                <span className="font-bold">Computed Slug:</span>{" "}
                <span className="font-mono">{computedSlug || "-"}</span>
              </div>
              <div>
                <span className="font-bold">Computed Route:</span>{" "}
                <span className="font-mono">{computedRoute}</span>
              </div>
            </div>

            <button
              disabled={loading || !computedSlug}
              onClick={onCreate}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black",
                loading || !computedSlug
                  ? "bg-zinc-200 text-zinc-500"
                  : "bg-emerald-600 text-white",
              ].join(" ")}
            >
              <MIcon name="rocket_launch" />
              {loading ? "Creating..." : "Create Brand"}
            </button>
          </div>

          {result ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <div className="font-black text-emerald-800">Created ✅</div>
              <div className="mt-1 text-emerald-900">
                slug: <span className="font-mono">{result.slug}</span> | route:{" "}
                <span className="font-mono">{result.route}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
