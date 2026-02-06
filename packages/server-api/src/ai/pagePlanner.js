import fetch from "node-fetch";

/**
 * Page Structure Planner
 * - Decides pages and section order per page (especially Home)
 * - Outputs STRICT JSON ONLY
 *
 * Output shape:
 * {
 *   "pages": {
 *     "Home": ["Hero","Stats",...],
 *     "Contact": [],
 *     "Services": []
 *   },
 *   "routes": [
 *     { "path": "/", "page": "Home" },
 *     { "path": "/services", "page": "Services" },
 *     { "path": "/contact", "page": "Contact" }
 *   ],
 *   "layout": {
 *     "useHeaderFooter": true
 *   }
 * }
 */
export async function runPagePlanner({ brand, visionPlan, contentJson, themeJson, prompt }) {
  if (!brand?.name) throw new Error("brand.name required");
  if (!visionPlan?.design || !Array.isArray(visionPlan?.sections)) {
    throw new Error("visionPlan.design + visionPlan.sections required");
  }
  if (!contentJson || typeof contentJson !== "object") {
    throw new Error("contentJson required");
  }
  if (!themeJson?.cssVars) {
    throw new Error("themeJson.cssVars required");
  }

  const system = `
You are a senior frontend architect.

Task:
- Produce a routing/page plan for a Vite + React + Tailwind site.
- Home page must be built from sections.
- Home page file must be src/pages/Home.jsx (not App.jsx).
- App.jsx should only contain router and layout wrapper decisions.
- Output STRICT JSON ONLY. No code.

Constraints:
- Keep it minimal: Home + Services + Contact + NotFound
- Home sections must come from visionPlan.sections
- Ensure anchors match ids: #features, #services, #process, #work, #faq
`;

  const user = `
Brand:
${JSON.stringify(
    {
      name: brand.name,
      slug: brand.slug || "",
      route: brand.route || "",
      description: brand.description || "",
    },
    null,
    2
  )}

Vision sections:
${JSON.stringify(visionPlan.sections, null, 2)}

Theme tokens:
${JSON.stringify(themeJson.tokens || {}, null, 2)}

Optional admin guidance:
${prompt || "None"}

Return STRICT JSON:

{
  "pages": {
    "Home": ["<section names>"],
    "Services": [],
    "Contact": []
  },
  "routes": [
    { "path": "/", "page": "Home" },
    { "path": "/services", "page": "Services" },
    { "path": "/contact", "page": "Contact" }
  ],
  "layout": {
    "useHeaderFooter": true,
    "homeAnchors": {
      "Features": "features",
      "Services": "services",
      "Process": "process",
      "Work": "work",
      "FAQ": "faq"
    }
  }
}

Rules:
- Home array MUST include every section from visionPlan.sections in same order.
- If section list includes "Features", include anchor mapping "features".
- If section list includes "FAQ", include anchor mapping "faq".
- Do NOT invent extra Home sections not in visionPlan.
- Output JSON ONLY.
`;

  const payload = {
    model: process.env.OPENAI_MODEL_VISION || "gpt-4.1",
    temperature: 0.1,
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
    throw new Error("OpenAI page plan error: " + t);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty GPT page plan response");

  const out = JSON.parse(content);

  // ✅ validate Home includes all sections
  const sections = visionPlan.sections;
  const home = out?.pages?.Home;
  if (!Array.isArray(home)) throw new Error("pages.Home missing/invalid");

  if (home.length !== sections.length) {
    throw new Error("pages.Home length mismatch with vision sections");
  }
  for (let i = 0; i < sections.length; i++) {
    if (home[i] !== sections[i]) {
      throw new Error(`Home section order mismatch at index ${i}`);
    }
  }

  return out;
}
