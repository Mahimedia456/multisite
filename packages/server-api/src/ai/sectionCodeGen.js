import fetch from "node-fetch";

/**
 * Step 5-A: Generate actual JSX files from:
 * - visionPlan (sections + bands + style)
 * - contentJson (copy)
 * - themeJson (tokens + cssVars mapping)
 * - pagePlan (routes + home section order)
 *
 * Returns:
 * {
 *   files: [{ path:"src/sections/Hero.jsx", content:"..." }, ...]
 * }
 */

function mustStr(v, name) {
  if (!v || typeof v !== "string") throw new Error(`${name} must be string`);
  return v;
}

function mustObj(v, name) {
  if (!v || typeof v !== "object") throw new Error(`${name} must be object`);
  return v;
}

function mustArr(v, name) {
  if (!Array.isArray(v)) throw new Error(`${name} must be array`);
  return v;
}

function validateFiles(out) {
  if (!out || typeof out !== "object") throw new Error("Invalid output");
  if (!Array.isArray(out.files)) throw new Error("Output must include files[]");

  for (const f of out.files) {
    if (!f?.path || !f?.content) throw new Error("Each file needs path + content");
    if (!String(f.path).startsWith("src/")) throw new Error("file.path must start with src/");
    if (typeof f.content !== "string") throw new Error("file.content must be string");
  }
  return out;
}

export async function runSectionCodeGen({
  brand,
  visionPlan,
  contentJson,
  themeJson,
  pagePlan,
  prompt,
}) {
  mustObj(brand, "brand");
  mustObj(visionPlan, "visionPlan");
  mustArr(visionPlan.sections, "visionPlan.sections");
  mustObj(themeJson, "themeJson");
  mustObj(pagePlan, "pagePlan");
  mustObj(contentJson, "contentJson");

  const sections = visionPlan.sections;

  // ✅ ensure Home order matches sections (dynamic but consistent)
  const home = pagePlan?.pages?.Home;
  if (!Array.isArray(home) || home.length !== sections.length) {
    throw new Error("pagePlan.pages.Home must equal visionPlan.sections");
  }
  for (let i = 0; i < sections.length; i++) {
    if (home[i] !== sections[i]) throw new Error(`Home mismatch at ${i}`);
  }

  const system = `
You are a senior React + Tailwind engineer.

Generate production-quality code files for a Vite + React + Tailwind v3 project.

ABSOLUTE RULES:
- Output STRICT JSON ONLY, no markdown.
- Provide files as: { "files":[{ "path":"src/...", "content":"..."}] }
- Use ONLY JavaScript/JSX (no TS).
- Home page MUST be "src/pages/Home.jsx".
- App.jsx must be Router-only, do NOT build home inside App.jsx.
- Sections must be created based on visionPlan.sections (NOT fixed).
- Each generated section file must read its own data from props: <Section data={content.SectionName} />
- Styling must reflect visionPlan.design (spacing/cardStyle/bands) and reference image vibe.
- Use theme-based classes: bg-brand-primary, bg-brand-accent, border-brand-border, text-brand-text, text-brand-muted, bg-brand-surface, bg-brand-bg.
- Anchors: if section name is Features/Services/Process/Work/FAQ set id=features/services/process/work/faq.
- Do NOT import images except optional reference (do not require local assets).
- Keep code clean, no external UI libs.
`;

  const user = `
Brand:
${JSON.stringify(
    {
      name: brand.name,
      slug: brand.slug,
      route: brand.route,
      description: brand.description || "",
      colors: brand.colors || {},
      company: brand.company || {},
    },
    null,
    2
  )}

Vision plan:
${JSON.stringify(visionPlan, null, 2)}

Theme tokens:
${JSON.stringify(themeJson?.tokens || {}, null, 2)}

Page plan:
${JSON.stringify(pagePlan, null, 2)}

Content JSON (section-based):
${JSON.stringify(contentJson, null, 2)}

Optional admin prompt:
${prompt || "None"}

Now generate these files:

1) src/pages/Home.jsx (assemble sections in order)
2) src/pages/Services.jsx (simple page, uses brand theme)
3) src/pages/Contact.jsx (simple page + contact info from brand.company)
4) src/pages/NotFound.jsx
5) src/sections/<Section>.jsx for EACH section in visionPlan.sections (dynamic)
6) src/components/Container.jsx
7) src/components/Button.jsx
8) src/components/SectionHeader.jsx (reusable heading/subheading)
9) src/App.jsx router-only (react-router-dom)
10) src/main.jsx

Output JSON ONLY:
{ "files": [ ... ] }

Extra:
- For dark bands (visionPlan.design.sectionBands), apply darker backgrounds + white text in those sections.
- Card style depends on visionPlan.design.cardStyle:
  - bordered => border + bg-brand-surface
  - shadow => shadow + bg-brand-surface
  - flat => no border, bg-transparent or bg-brand-surface
  - rounded => larger radius (rounded-3xl)
- Spacing depends on visionPlan.design.spacing:
  - tight => py-12
  - normal => py-14
  - large => py-18
`;

  const payload = {
    model: process.env.OPENAI_MODEL_CODE || process.env.OPENAI_MODEL_VISION || "gpt-4.1",
    temperature: 0.25,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("OpenAI section-code error: " + t);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty section-code response");

  const out = JSON.parse(content);
  return validateFiles(out);
}
