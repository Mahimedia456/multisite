import fetch from "node-fetch";

/**
 * GPT Content Writer (Home Page)
 * Input:
 *  - brand (name/desc/colors/company)
 *  - visionPlan (design + sections)
 *  - prompt (optional)
 *
 * Output: STRICT JSON ONLY
 *  {
 *    "Hero": {...},
 *    "Stats": {...},
 *    "Features": {...},
 *    ...
 *  }
 */
export async function runHomeContentWriter({
  brand,
  visionPlan,
  prompt,
}) {
  if (!brand?.name) throw new Error("brand.name required");
  if (!visionPlan?.design || !Array.isArray(visionPlan?.sections)) {
    throw new Error("visionPlan with design + sections is required");
  }

  const system = `
You are an expert conversion copywriter and web strategist.

Task:
- Write HIGH QUALITY Home page content for the provided brand.
- Use the section list and design style from the vision plan.
- Keep content realistic, professional, and production-ready.
- Output STRICT JSON ONLY.
- DO NOT output JSX/HTML/CSS.
- Do NOT mention "AI", "ChatGPT", "OpenAI", or the prompt.

Tone:
- Match brand and optional guidance
- Avoid fluff
- Clear headings, short paragraphs, strong CTAs
`;

  const sections = visionPlan.sections;

  // We enforce a consistent schema per section type
  const schemaHint = `
Return JSON where keys are EXACT section names from this list:
${JSON.stringify(sections)}

For each section, follow these shapes:

Hero:
{
  "badge": "short label",
  "headline": "7-12 words max",
  "subheading": "1-2 lines",
  "primaryCta": { "label": "...", "href": "/contact" },
  "secondaryCta": { "label": "...", "href": "#services" },
  "highlights": ["...", "...", "..."] // 3 bullets max
}

Stats:
{ "items": [{ "label": "...", "value": "..." }, ...] } // 3-4 items

Features:
{ "headline": "...", "subheading": "...", "items": [{ "title": "...", "desc": "..." }, ...] } // 3-6 items

Services:
{ "headline": "...", "items": [{ "title": "...", "desc": "...", "points": ["..",".."] }, ...] } // 3-6 items, points 2-3

Process:
{ "headline": "...", "steps": [{ "title": "...", "desc": "..." }, ...] } // 3-5 steps

Work:
{ "headline": "...", "projects": [{ "title": "...", "desc": "...", "tags": ["..",".."] }, ...] } // 3-6 projects

Testimonials:
{ "headline": "...", "items": [{ "name": "...", "role": "...", "quote": "..." }, ...] } // 2-4

FAQ:
{ "headline": "...", "items": [{ "q": "...", "a": "..." }, ...] } // 5-8

CTA:
{ "headline": "...", "subheading": "...", "cta": { "label": "...", "href": "/contact" } }

If a section is not in the list, DO NOT include it.
If a section is in the list, it MUST exist in output JSON.

Keep hrefs simple: "/contact", "/quote", "/services", "#features", "#faq"
`;

  const user = `
Brand:
${JSON.stringify(
    {
      name: brand.name,
      description: brand.description || "",
      colors: brand.colors || {},
      font: brand.font || {},
      company: brand.company || {},
      route: brand.route || "",
      slug: brand.slug || "",
    },
    null,
    2
  )}

Vision plan:
${JSON.stringify(visionPlan, null, 2)}

Optional admin guidance (may be empty):
${prompt ? prompt : "None"}

${schemaHint}
`;

  const payload = {
    model: process.env.OPENAI_MODEL_VISION || "gpt-4.1",
    temperature: 0.6,
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
    throw new Error("OpenAI content error: " + t);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty GPT content response");

  const out = JSON.parse(content);

  // ✅ validation: must include every required section key
  for (const s of sections) {
    if (!(s in out)) {
      throw new Error(`Missing section in content JSON: ${s}`);
    }
  }

  return out;
}
