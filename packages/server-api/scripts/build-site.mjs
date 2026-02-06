import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import fetch from "node-fetch";

/* =========================================
  Small utils
========================================= */
function log(...a) {
  process.stdout.write(a.join(" ") + "\n");
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function write(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf8");
}
function read(p) {
  return fs.readFileSync(p, "utf8");
}
function safeSlug(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function sh(cmd, cwd) {
  log("$", cmd);
  execSync(cmd, { cwd, stdio: "inherit" });
}
function mustGetPayload() {
  const raw = process.env.JOB_PAYLOAD;
  if (!raw) throw new Error("Missing JOB_PAYLOAD env");
  return JSON.parse(raw);
}

function isSafeSrcPath(p) {
  const s = String(p || "");
  return s.startsWith("src/") && !s.includes("..") && !path.isAbsolute(s);
}

function writeMany(projectDir, files) {
  for (const f of files) {
    const outPath = path.join(projectDir, f.path);
    write(outPath, f.content);
  }
}

/* =========================================
  OpenAI helper (JSON-only)
========================================= */
async function openaiJson({ model, messages, temperature = 0.2 }) {
  const apiKey = process.env.OPENAI_API_KEY;

  // ✅ allow running without OpenAI (fallback)
  if (!apiKey || process.env.AI_DISABLED === "true") {
    const e = new Error("AI_DISABLED_OR_KEY_MISSING");
    e.code = "AI_DISABLED_OR_KEY_MISSING";
    throw e;
  }

  const body = {
    model: model || process.env.OPENAI_MODEL_VISION || "gpt-4.1",
    messages,
    temperature,
    response_format: { type: "json_object" },
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();

    // ✅ normalize quota error so we can fallback
    let code = "OPENAI_ERROR";
    try {
      const j = JSON.parse(t);
      code = j?.error?.code || j?.error?.type || code;
    } catch {}

    const err = new Error("OpenAI error: " + t);
    err.code = code;
    throw err;
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error("Empty OpenAI response");
    err.code = "EMPTY_RESPONSE";
    throw err;
  }

  return JSON.parse(content);
}
function fallbackVisionPlan(brand) {
  return {
    design: {
      style: "modern",
      spacing: "normal",
      cardStyle: "bordered",
      sectionBands: ["light", "light", "light", "light", "light", "light", "light", "light", "light"],
    },
    sections: ["Hero", "Stats", "Features", "Services", "Process", "Work", "Testimonials", "FAQ", "CTA"],
  };
}

function fallbackHomeContent(brand, visionPlan) {
  const name = brand?.name || "Brand";
  return {
    Hero: {
      badge: `${name} • Official`,
      headline: `${name} that people trust`,
      subheading: brand?.description || "We build quality solutions with modern design and reliable delivery.",
      primaryCta: { label: "Get Started", href: "/contact" },
      secondaryCta: { label: "View Services", href: "#services" },
      highlights: ["Fast delivery", "Premium quality", "Trusted support"],
    },
    Stats: { items: [{ label: "Projects", value: "120+" }, { label: "Clients", value: "80+" }, { label: "Years", value: "10+" }, { label: "Support", value: "24/7" }] },
    Features: { headline: "Why choose us", subheading: "A simple, clean foundation you can extend.", items: [
      { title: "Quality first", desc: "Clean design, strong UX, and best practices." },
      { title: "Fast turnaround", desc: "Quick iterations with reliable delivery." },
      { title: "Brand-ready", desc: "Theme + sections aligned to your brand." },
    ]},
    Services: { headline: "Services", items: [
      { title: "Consultation", desc: "We understand your needs.", points: ["Discovery", "Planning", "Roadmap"] },
      { title: "Delivery", desc: "We build and deliver.", points: ["Build", "Test", "Launch"] },
      { title: "Support", desc: "We keep it running.", points: ["Monitoring", "Updates", "Care"] },
    ]},
    Process: { headline: "Our process", steps: [
      { title: "Discover", desc: "Requirements + goals." },
      { title: "Design", desc: "Wireframe + UI direction." },
      { title: "Build", desc: "Develop + integrate." },
      { title: "Launch", desc: "Deploy + optimize." },
    ]},
    Work: { headline: "Recent work", projects: [
      { title: "Project Alpha", desc: "A modern website experience.", tags: ["UI", "Brand", "Web"] },
      { title: "Project Beta", desc: "Conversion-focused landing.", tags: ["Speed", "SEO", "React"] },
      { title: "Project Gamma", desc: "Clean layout + sections.", tags: ["Design", "Content", "Build"] },
    ]},
    Testimonials: { headline: "Testimonials", items: [
      { name: "Client A", role: "Business Owner", quote: "Amazing experience and great support." },
      { name: "Client B", role: "Manager", quote: "Fast delivery and high quality." },
    ]},
    FAQ: { headline: "FAQ", items: [
      { q: "How fast is delivery?", a: "Typically within days depending on scope." },
      { q: "Do you provide support?", a: "Yes, ongoing support is available." },
      { q: "Can I edit content later?", a: "Yes, your content JSON can be regenerated." },
      { q: "Do you use modern tech?", a: "Yes, Vite + React + Tailwind." },
      { q: "Can sections change?", a: "Yes, section plan is flexible." },
    ]},
    CTA: { headline: "Ready to build?", subheading: "Send your prompt and we’ll generate the next version.", cta: { label: "Contact", href: "/contact" } },
  };
}

function fallbackTheme(brand) {
  // simple safe palette
  return {
    cssVars: {
      light: {
        "--brand-primary": "34 197 94",
        "--brand-accent": "250 204 21",
        "--brand-bg": "255 255 255",
        "--brand-surface": "245 245 245",
        "--brand-text": "24 24 27",
        "--brand-muted": "82 82 91",
        "--brand-border": "228 228 231",
      },
      dark: {
        "--brand-primary": "34 197 94",
        "--brand-accent": "250 204 21",
        "--brand-bg": "9 9 11",
        "--brand-surface": "24 24 27",
        "--brand-text": "244 244 245",
        "--brand-muted": "161 161 170",
        "--brand-border": "63 63 70",
      },
    },
    tailwind: {
      colors: {
        brand: {
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          bg: "rgb(var(--brand-bg) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          text: "rgb(var(--brand-text) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          border: "rgb(var(--brand-border) / <alpha-value>)",
        },
      },
    },
    fonts: {
      family: brand?.font?.family || "Plus Jakarta Sans",
      googleUrl: brand?.font?.googleUrl || "",
    },
    tokens: { radius: 16, shadow: "soft", spacing: "normal", cardStyle: "bordered" },
  };
}

function fallbackPagePlan(visionPlan) {
  return {
    pages: {
      Home: visionPlan.sections,
      Services: [],
      Contact: [],
    },
    routes: [
      { path: "/", page: "Home" },
      { path: "/services", page: "Services" },
      { path: "/contact", page: "Contact" },
    ],
    layout: {
      useHeaderFooter: true,
      homeAnchors: {
        Features: "features",
        Services: "services",
        Process: "process",
        Work: "work",
        FAQ: "faq",
      },
    },
  };
}

/* =========================================
  STEP 1: Vision Plan (image)
========================================= */
async function step1VisionPlan({ brand, referenceImageUrl, prompt }) {
  if (!referenceImageUrl) throw new Error("referenceImageUrl required for Step 1");

  const system = `
You are a senior UI/UX architect.
Analyze the website reference image and plan a professional Home page layout.
Do NOT write marketing content.
Do NOT output JSX/HTML/CSS.
Output STRICT JSON only.
`;

  const userText = `
Brand name: ${brand.name}
Brand description: ${brand.description || "N/A"}
Primary: ${brand.colors?.primary || "N/A"}
Accent: ${brand.colors?.accent || "N/A"}

Optional admin prompt:
${prompt || "None"}

Return JSON:
{
 "design": {
  "style": "industrial | modern | minimal | corporate | creative",
  "spacing": "tight | normal | large",
  "cardStyle": "flat | bordered | shadow | rounded",
  "sectionBands": ["dark" | "light"]
 },
 "sections": ["Hero","Stats","Features","Services","Process","Work","Testimonials","FAQ","CTA"]
}
Rules:
- sectionBands length MUST match sections length
- output JSON only
`;

  return await openaiJson({
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          { type: "image_url", image_url: { url: referenceImageUrl } },
        ],
      },
    ],
    temperature: 0.3,
  });
}

/* =========================================
  STEP 2: Home Content JSON (copy)
========================================= */
async function step2HomeContent({ brand, visionPlan, prompt }) {
  const system = `
You are an expert conversion copywriter and web strategist.
Write high-quality HOME page content for the given brand and section list.
Do NOT output JSX/HTML/CSS.
Output STRICT JSON only.
`;

  const sections = visionPlan.sections;

  const schemaHint = `
Return JSON keys EXACTLY matching this array:
${JSON.stringify(sections)}

Use shapes:
Hero: { badge, headline, subheading, primaryCta:{label,href}, secondaryCta:{label,href}, highlights:[...max3] }
Stats: { items:[{label,value},...3-4] }
Features: { headline, subheading, items:[{title,desc},...3-6] }
Services: { headline, items:[{title,desc,points:[..2-3]},...3-6] }
Process: { headline, steps:[{title,desc},...3-5] }
Work: { headline, projects:[{title,desc,tags:[..2-3]},...3-6] }
Testimonials: { headline, items:[{name,role,quote},...2-4] }
FAQ: { headline, items:[{q,a},...5-8] }
CTA: { headline, subheading, cta:{label,href} }

href allowed: "/contact" "/quote" "/services" "#features" "#services" "#process" "#work" "#faq"
All sections in list MUST exist.
Output JSON only.
`;

  const user = `
Brand:
${JSON.stringify(brand, null, 2)}

Vision plan:
${JSON.stringify(visionPlan, null, 2)}

Optional admin prompt:
${prompt || "None"}

${schemaHint}
`;

  const out = await openaiJson({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.6,
  });

  for (const s of sections) {
    if (!(s in out)) throw new Error(`Step2 missing section: ${s}`);
  }

  return out;
}

/* =========================================
  STEP 3: Theme JSON (css vars + tailwind mapping)
========================================= */
async function step3Theme({ brand, visionPlan, prompt }) {
  const system = `
You are a senior design system engineer.
Generate a brand-aware theme for React + Tailwind.
Output STRICT JSON only (no code).
Prefer rgb triplets "R G B" for CSS vars.
`;

  const user = `
Brand:
${JSON.stringify(brand, null, 2)}

Vision plan:
${JSON.stringify(visionPlan, null, 2)}

Optional admin prompt:
${prompt || "None"}

Return JSON ONLY in this exact structure:
{
 "cssVars":{
  "light":{
   "--brand-primary":"R G B",
   "--brand-accent":"R G B",
   "--brand-bg":"R G B",
   "--brand-surface":"R G B",
   "--brand-text":"R G B",
   "--brand-muted":"R G B",
   "--brand-border":"R G B"
  },
  "dark":{
   "--brand-primary":"R G B",
   "--brand-accent":"R G B",
   "--brand-bg":"R G B",
   "--brand-surface":"R G B",
   "--brand-text":"R G B",
   "--brand-muted":"R G B",
   "--brand-border":"R G B"
  }
 },
 "tailwind":{
  "colors":{
   "brand":{
    "primary":"rgb(var(--brand-primary) / <alpha-value>)",
    "accent":"rgb(var(--brand-accent) / <alpha-value>)",
    "bg":"rgb(var(--brand-bg) / <alpha-value>)",
    "surface":"rgb(var(--brand-surface) / <alpha-value>)",
    "text":"rgb(var(--brand-text) / <alpha-value>)",
    "muted":"rgb(var(--brand-muted) / <alpha-value>)",
    "border":"rgb(var(--brand-border) / <alpha-value>)"
   }
  }
 },
 "fonts":{
  "family":"string",
  "googleUrl":"string or empty"
 },
 "tokens":{
  "radius":16,
  "shadow":"soft | none | strong",
  "spacing":"tight | normal | large",
  "cardStyle":"flat | bordered | shadow | rounded"
 }
}
Rules:
- Ensure readable text/background.
- If design includes dark bands, dark vars must be usable.
- Output JSON only.
`;

  const out = await openaiJson({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
  });

  if (!out?.cssVars?.light || !out?.cssVars?.dark) throw new Error("Step3 missing cssVars");
  if (!out?.tailwind?.colors) throw new Error("Step3 missing tailwind.colors");
  if (!out?.fonts?.family) out.fonts = { ...(out.fonts || {}), family: "Plus Jakarta Sans", googleUrl: "" };

  return out;
}

/* =========================================
  STEP 4: Page Plan (routes + pages)
========================================= */
async function step4PagePlan({ brand, visionPlan, themeJson, prompt }) {
  const system = `
You are a senior frontend architect.
Create a minimal routing plan for a Vite + React + Tailwind site.
Home must be src/pages/Home.jsx (NOT App.jsx).
App.jsx router only.
Output STRICT JSON only.
`;

  const user = `
Brand:
${JSON.stringify({ name: brand.name, slug: brand.slug, route: brand.route }, null, 2)}

Vision sections:
${JSON.stringify(visionPlan.sections, null, 2)}

Theme tokens:
${JSON.stringify(themeJson.tokens || {}, null, 2)}

Optional admin prompt:
${prompt || "None"}

Return JSON:
{
 "pages":{
  "Home":["<sections exactly as visionPlan.sections in same order>"],
  "Services":[],
  "Contact":[]
 },
 "routes":[
  {"path":"/","page":"Home"},
  {"path":"/services","page":"Services"},
  {"path":"/contact","page":"Contact"}
 ],
 "layout":{
  "useHeaderFooter": true,
  "homeAnchors":{
   "Features":"features",
   "Services":"services",
   "Process":"process",
   "Work":"work",
   "FAQ":"faq"
  }
 }
}
Rules:
- pages.Home MUST include all vision sections in same order
- output JSON only
`;

  const out = await openaiJson({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.1,
  });

  const home = out?.pages?.Home;
  if (!Array.isArray(home)) throw new Error("Step4 missing pages.Home");
  if (home.length !== visionPlan.sections.length) throw new Error("Step4 Home length mismatch");
  for (let i = 0; i < home.length; i++) {
    if (home[i] !== visionPlan.sections[i]) throw new Error(`Step4 Home order mismatch at ${i}`);
  }

  return out;
}

/* =========================================
  STEP 5-A (OPTION A): AI generates JSX files
  ✅ Dynamic sections, pages, router-only App.jsx
========================================= */
async function step5A_CodeFiles({ brand, visionPlan, contentJson, themeJson, pagePlan, prompt }) {
  const system = `
You are a senior React + Tailwind engineer.

Generate production-quality code files for a Vite + React + Tailwind v3 project.

ABSOLUTE RULES:
- Output STRICT JSON ONLY, no markdown.
- Output format: { "files":[{ "path":"src/...", "content":"..."}] }
- Use ONLY JavaScript/JSX (no TS).
- Home page MUST be "src/pages/Home.jsx".
- App.jsx must be Router-only (react-router-dom).
- Sections must be created based on visionPlan.sections (dynamic).
- Each section must accept props: ({ data }) and use contentJson[SectionName].
- Use theme classes:
  bg-brand-bg, bg-brand-surface, text-brand-text, text-brand-muted,
  border-brand-border, bg-brand-primary, bg-brand-accent
- Add anchor ids for:
  Features->features, Services->services, Process->process, Work->work, FAQ->faq
- Do not require any local images/assets.
- Keep code clean, reusable components allowed.
`;

  const user = `
Brand:
${JSON.stringify(brand, null, 2)}

Vision plan:
${JSON.stringify(visionPlan, null, 2)}

Theme tokens:
${JSON.stringify(themeJson?.tokens || {}, null, 2)}

Page plan:
${JSON.stringify(pagePlan, null, 2)}

Content JSON:
${JSON.stringify(contentJson, null, 2)}

Optional admin prompt:
${prompt || "None"}

Generate these files:

1) src/pages/Home.jsx (assemble sections in exact order from pagePlan.pages.Home)
2) src/pages/Services.jsx (simple + themed)
3) src/pages/Contact.jsx (simple + themed; show brand.company)
4) src/pages/NotFound.jsx
5) src/sections/<Section>.jsx for EACH section in visionPlan.sections
6) src/components/Container.jsx
7) src/components/Button.jsx
8) src/components/SectionHeader.jsx
9) src/App.jsx (router-only with 4 routes: /, /services, /contact, *)
10) src/main.jsx

Output JSON ONLY.
`;

  const out = await openaiJson({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.25,
  });

  if (!out || !Array.isArray(out.files)) throw new Error("Step5-A must return {files:[]}");
  // safety: only allow src/
  const files = out.files
    .filter((f) => f && typeof f.path === "string" && typeof f.content === "string")
    .filter((f) => isSafeSrcPath(f.path));

  // validations
  const required = [
    "src/pages/Home.jsx",
    "src/pages/Services.jsx",
    "src/pages/Contact.jsx",
    "src/pages/NotFound.jsx",
    "src/App.jsx",
    "src/main.jsx",
    "src/components/Container.jsx",
    "src/components/Button.jsx",
    "src/components/SectionHeader.jsx",
  ];

  for (const r of required) {
    if (!files.find((x) => x.path === r)) {
      throw new Error(`Step5-A missing file: ${r}`);
    }
  }

  for (const s of visionPlan.sections) {
    const p = `src/sections/${s}.jsx`;
    if (!files.find((x) => x.path === p)) {
      throw new Error(`Step5-A missing section file: ${p}`);
    }
  }

  return files;
}

/* =========================================
  Project scaffolding helpers
========================================= */
function createBaseFolders(projectDir) {
  ensureDir(path.join(projectDir, "src", "components"));
  ensureDir(path.join(projectDir, "src", "sections"));
  ensureDir(path.join(projectDir, "src", "pages"));
  ensureDir(path.join(projectDir, "src", "lib"));
  ensureDir(path.join(projectDir, "src", "assets"));
}

function patchTailwindFiles(projectDir, themeJson) {
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: ${JSON.stringify(themeJson?.tailwind?.colors || {}, null, 2)}
    },
  },
  plugins: [],
};
`;
  write(path.join(projectDir, "tailwind.config.js"), tailwindConfig);

  const light = themeJson?.cssVars?.light || {};
  const dark = themeJson?.cssVars?.dark || {};

  const lightBlock = Object.entries(light).map(([k, v]) => `  ${k}: ${v};`).join("\n");
  const darkBlock = Object.entries(dark).map(([k, v]) => `  ${k}: ${v};`).join("\n");

  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root{
${lightBlock || "  --brand-primary: 30 194 179;\n  --brand-accent: 252 211 77;\n  --brand-bg: 246 248 248;\n  --brand-surface: 255 255 255;\n  --brand-text: 15 23 42;\n  --brand-muted: 100 116 139;\n  --brand-border: 226 232 240;"}
  color-scheme: light;
}

[data-theme="dark"]{
${darkBlock || "  --brand-primary: 30 194 179;\n  --brand-accent: 252 211 77;\n  --brand-bg: 9 9 11;\n  --brand-surface: 24 24 27;\n  --brand-text: 244 244 245;\n  --brand-muted: 161 161 170;\n  --brand-border: 63 63 70;"}
  color-scheme: dark;
}

html, body { height: 100%; }

body {
  background: rgb(var(--brand-bg));
  color: rgb(var(--brand-text));
}
`;
  write(path.join(projectDir, "src", "index.css"), indexCss);
}

function writeThemeLib(projectDir, payload, themeJson) {
  const b = payload?.brand || {};
  const primary = b?.colors?.primary || "#2ec2b3";
  const accent = b?.colors?.accent || primary;

  const fontFamily = themeJson?.fonts?.family || b?.font?.family || "Plus Jakarta Sans";
  const fontGoogleUrl = themeJson?.fonts?.googleUrl || b?.font?.googleUrl || "";

  const themeJs = `export const theme = {
  brandName: ${JSON.stringify(b?.name || "Brand")},
  brandSlug: ${JSON.stringify(b?.slug || "")},
  route: ${JSON.stringify(b?.route || "/")},
  colors: {
    primary: ${JSON.stringify(primary)},
    accent: ${JSON.stringify(accent)},
  },
  font: {
    family: ${JSON.stringify(fontFamily)},
    googleUrl: ${JSON.stringify(fontGoogleUrl)},
  },
  referenceImageUrl: ${JSON.stringify(payload?.referenceImageUrl || null)},
  tokens: ${JSON.stringify(themeJson?.tokens || {}, null, 2)},
};
`;
  write(path.join(projectDir, "src", "lib", "theme.js"), themeJs);
}

function injectGoogleFont(projectDir, googleUrl) {
  const fontUrl = String(googleUrl || "").trim();
  if (!fontUrl) return;

  const htmlPath = path.join(projectDir, "index.html");
  const html = read(htmlPath);
  if (html.includes(fontUrl)) return;

  const injected = html.replace(
    "</head>",
    `  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="${fontUrl}" rel="stylesheet">\n</head>`
  );
  write(htmlPath, injected);
}

/* =========================================
  MAIN RUN
========================================= */
async function run() {
  const payload = mustGetPayload();

  const brandSlug = safeSlug(payload?.brand?.slug || payload?.brand?.name || "brand");
  const outRoot = payload.outRoot || path.resolve(process.cwd(), "generated-sites");
  const projectDir = path.join(outRoot, brandSlug);

  const prompt = String(payload?.message || "").trim() || "";
  const referenceImageUrl = payload?.referenceImageUrl || null;

  const brand = {
    name: payload?.brand?.name || "Brand",
    slug: payload?.brand?.slug || brandSlug,
    route: payload?.brand?.route || "/",
    description: payload?.brand?.description || "",
    colors: payload?.brand?.colors || {},
    font: payload?.brand?.font || {},
    company: payload?.brand?.company || {},
  };

  log("jobId:", payload.jobId);
  log("Generating site at:", projectDir);

  ensureDir(outRoot);

  // 1) create vite app
  if (!fs.existsSync(projectDir)) {
    sh(`npm create vite@latest ${brandSlug} -- --template react`, outRoot);
  } else {
    log("Project folder already exists, skipping vite create.");
  }

  // 2) install deps + tailwind + router
  sh(`npm i`, projectDir);
  sh(`npm i react-router-dom`, projectDir);
  sh(`npm i -D tailwindcss@3.4.10 postcss autoprefixer`, projectDir);
  sh(`npx tailwindcss init -p`, projectDir);

  // 3) folders
  createBaseFolders(projectDir);

  log("🧠 STEP 1: Vision plan...");
let visionPlan;
try {
  visionPlan = referenceImageUrl
    ? await step1VisionPlan({ brand, referenceImageUrl, prompt })
    : fallbackVisionPlan(brand);
} catch (e) {
  const allowFallback = process.env.ALLOW_FALLBACK !== "false";
  if (!allowFallback) throw e;

  jobAppend?.(payload?.jobId, `⚠️ AI Step1 failed (${e.code || "unknown"}). Using fallback vision plan.`);
  log("⚠️ Step1 failed, using fallback:", e.code || e.message);
  visionPlan = fallbackVisionPlan(brand);
}

log("✍️ STEP 2: Home content...");
let contentJson;
try {
  contentJson = await step2HomeContent({ brand, visionPlan, prompt });
} catch (e) {
  const allowFallback = process.env.ALLOW_FALLBACK !== "false";
  if (!allowFallback) throw e;

  log("⚠️ Step2 failed, using fallback:", e.code || e.message);
  contentJson = fallbackHomeContent(brand, visionPlan);
}

log("🎨 STEP 3: Theme...");
let themeJson;
try {
  themeJson = await step3Theme({ brand, visionPlan, prompt });
} catch (e) {
  const allowFallback = process.env.ALLOW_FALLBACK !== "false";
  if (!allowFallback) throw e;

  log("⚠️ Step3 failed, using fallback:", e.code || e.message);
  themeJson = fallbackTheme(brand);
}

log("🧭 STEP 4: Page plan...");
let pagePlan;
try {
  pagePlan = await step4PagePlan({ brand, visionPlan, contentJson, themeJson, prompt });
} catch (e) {
  const allowFallback = process.env.ALLOW_FALLBACK !== "false";
  if (!allowFallback) throw e;

  log("⚠️ Step4 failed, using fallback:", e.code || e.message);
  pagePlan = fallbackPagePlan(visionPlan);
}


  // 5) write config/css/theme
  patchTailwindFiles(projectDir, themeJson);
  writeThemeLib(projectDir, payload, themeJson);
  injectGoogleFont(projectDir, themeJson?.fonts?.googleUrl || brand?.font?.googleUrl);

  // ✅ STEP 5-A: AI generates all pages + sections dynamically
  log("🧩 STEP 5-A: Generating JSX files (dynamic sections/pages)...");
  const files = await step5A_CodeFiles({
    brand,
    visionPlan,
    contentJson,
    themeJson,
    pagePlan,
    prompt,
  });

  // write all AI files under src/*
  writeMany(projectDir, files);

  log("✅ DONE. Next:");
  log("cd", projectDir);
  log("npm run dev");
}

run().catch((e) => {
  process.stderr.write(String(e?.stack || e?.message || e) + "\n");
  process.exit(1);
});
