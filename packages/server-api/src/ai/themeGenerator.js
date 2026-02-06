import fetch from "node-fetch";

/**
 * Theme Generator
 * - Input: brand + visionPlan + optional prompt
 * - Output: STRICT JSON ONLY
 *
 * Output shape:
 * {
 *   "cssVars": { ... },
 *   "tailwind": { ... },
 *   "fonts": { ... },
 *   "tokens": { ... }
 * }
 */
export async function runThemeGenerator({ brand, visionPlan, prompt }) {
  if (!brand?.name) throw new Error("brand.name required");
  if (!visionPlan?.design) throw new Error("visionPlan.design required");

  const system = `
You are a senior design system engineer.

Task:
- Generate a brand-aware theme for a React + Tailwind site.
- Output STRICT JSON ONLY.
- Do NOT output CSS/JSX, only JSON describing theme tokens.
- Use the brand's colors and the vision plan style.
- Ensure good contrast and readable defaults.

Important:
- Prefer CSS variables compatible with Tailwind: rgb triplets ("R G B")
- Keep names stable: --brand-primary, --brand-accent, --brand-bg, --brand-surface, --brand-text, --brand-muted, --brand-border
- Provide both light and dark values if style uses dark bands.
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
    },
    null,
    2
  )}

Vision plan:
${JSON.stringify(visionPlan, null, 2)}

Optional admin guidance:
${prompt || "None"}

Return STRICT JSON with this exact structure:

{
  "cssVars": {
    "light": {
      "--brand-primary": "R G B",
      "--brand-accent": "R G B",
      "--brand-bg": "R G B",
      "--brand-surface": "R G B",
      "--brand-text": "R G B",
      "--brand-muted": "R G B",
      "--brand-border": "R G B"
    },
    "dark": {
      "--brand-primary": "R G B",
      "--brand-accent": "R G B",
      "--brand-bg": "R G B",
      "--brand-surface": "R G B",
      "--brand-text": "R G B",
      "--brand-muted": "R G B",
      "--brand-border": "R G B"
    }
  },
  "tailwind": {
    "colors": {
      "brand": {
        "primary": "rgb(var(--brand-primary) / <alpha-value>)",
        "accent": "rgb(var(--brand-accent) / <alpha-value>)",
        "bg": "rgb(var(--brand-bg) / <alpha-value>)",
        "surface": "rgb(var(--brand-surface) / <alpha-value>)",
        "text": "rgb(var(--brand-text) / <alpha-value>)",
        "muted": "rgb(var(--brand-muted) / <alpha-value>)",
        "border": "rgb(var(--brand-border) / <alpha-value>)"
      }
    }
  },
  "fonts": {
    "family": "string",
    "googleUrl": "string or empty"
  },
  "tokens": {
    "radius": "number",
    "shadow": "soft | none | strong",
    "spacing": "tight | normal | large",
    "cardStyle": "flat | bordered | shadow | rounded"
  }
}

Rules:
- Use brand primary/accent as base, but ensure readable text/border/background.
- If visionPlan.design.sectionBands includes "dark", fill dark vars sensibly.
- If brand font is missing, choose "Plus Jakarta Sans".
- Return JSON ONLY.
`;

  const payload = {
    model: process.env.OPENAI_MODEL_VISION || "gpt-4.1",
    temperature: 0.2,
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
    throw new Error("OpenAI theme error: " + t);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty GPT theme response");

  const out = JSON.parse(content);

  // Basic validation
  if (!out?.cssVars?.light || !out?.cssVars?.dark) {
    throw new Error("Theme JSON missing cssVars.light/dark");
  }
  if (!out?.tailwind?.colors?.brand) {
    throw new Error("Theme JSON missing tailwind.colors.brand mapping");
  }
  if (!out?.fonts?.family) {
    out.fonts = out.fonts || {};
    out.fonts.family = "Plus Jakarta Sans";
  }

  return out;
}
