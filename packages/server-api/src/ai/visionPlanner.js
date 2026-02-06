import fetch from "node-fetch";

/**
 * GPT Vision Planner
 * - NO JSX
 * - NO CONTENT
 * - STRICT JSON ONLY
 */
export async function runVisionPlanner({
  brand,
  referenceImageUrl,
  prompt, // optional
}) {
  if (!referenceImageUrl) {
    throw new Error("referenceImageUrl is required for vision planner");
  }

  const systemPrompt = `
You are a senior UI/UX architect.

Your task:
- Analyze the given website reference image
- Plan a professional HOME PAGE layout
- Decide section order and visual style
- Do NOT write any marketing content
- Do NOT output JSX, HTML, or CSS
- Output STRICT JSON ONLY

The website must feel:
- modern
- production-ready
- SaaS / industrial quality depending on brand

Brand info is provided for context only.
Optional user prompt may guide style preferences.
`;

  const userPrompt = `
Brand name: ${brand.name}
Brand description: ${brand.description || "N/A"}
Primary color: ${brand.colors?.primary || "N/A"}
Accent color: ${brand.colors?.accent || "N/A"}

Optional guidance from admin:
${prompt || "No extra guidance. Decide automatically."}

Analyze the reference image and return a JSON plan with:

{
  "design": {
    "style": "industrial | modern | minimal | corporate | creative",
    "spacing": "tight | normal | large",
    "cardStyle": "flat | bordered | shadow | rounded",
    "sectionBands": ["dark" | "light"]
  },
  "sections": [
    "Hero",
    "Stats",
    "Features",
    "Services",
    "Process",
    "Work",
    "Testimonials",
    "FAQ",
    "CTA"
  ]
}

Rules:
- sectionBands length MUST match sections length
- Sections must be suitable for HOME PAGE
- Order matters
- Output JSON only
`;

  const payload = {
    model: process.env.OPENAI_MODEL_VISION || "gpt-4.1",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: { url: referenceImageUrl },
          },
        ],
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
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
    const err = await res.text();
    throw new Error("OpenAI Vision error: " + err);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty GPT vision response");
  }

  return JSON.parse(content);
}
