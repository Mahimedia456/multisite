function detectLanguage(text = "") {
  const value = String(text || "").toLowerCase();

  const germanHints = [
    "der",
    "die",
    "das",
    "und",
    "ist",
    "nicht",
    "ich",
    "wir",
    "sie",
    "bitte",
    "danke",
    "versicherung",
    "schaden",
    "angebot",
    "hilfe",
    "kontakt",
    "können",
    "möchte",
    "über",
    "für",
    "mit",
    "ß",
    "ä",
    "ö",
    "ü",
  ];

  const englishHints = [
    "the",
    "and",
    "is",
    "not",
    "i",
    "we",
    "you",
    "please",
    "thanks",
    "insurance",
    "claim",
    "quote",
    "help",
    "contact",
    "can",
    "would",
    "about",
    "for",
    "with",
  ];

  let deScore = 0;
  let enScore = 0;

  for (const word of germanHints) {
    if (value.includes(word)) deScore += 1;
  }

  for (const word of englishHints) {
    if (value.includes(word)) enScore += 1;
  }

  if (deScore > enScore) return "de";
  if (enScore > deScore) return "en";

  return "auto";
}

function normalizeLang(lang) {
  const value = String(lang || "").toLowerCase();

  if (value === "german" || value === "deutsch" || value === "de") return "de";
  if (value === "english" || value === "eng" || value === "en") return "en";

  return "auto";
}

export async function translateText({ text, from = "auto", to = "en" }) {
  const original = String(text || "").trim();

  if (!original) {
    return {
      originalText: "",
      translatedText: "",
      detectedLanguage: "auto",
      translatedLanguage: normalizeLang(to),
    };
  }

  const detectedLanguage =
    normalizeLang(from) === "auto" ? detectLanguage(original) : normalizeLang(from);

  const targetLanguage = normalizeLang(to);

  if (
    detectedLanguage !== "auto" &&
    targetLanguage !== "auto" &&
    detectedLanguage === targetLanguage
  ) {
    return {
      originalText: original,
      translatedText: original,
      detectedLanguage,
      translatedLanguage: targetLanguage,
    };
  }

  try {
    const langPair =
      detectedLanguage === "auto"
        ? `de|${targetLanguage}`
        : `${detectedLanguage}|${targetLanguage}`;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      original
    )}&langpair=${encodeURIComponent(langPair)}`;

    const res = await fetch(url);
    const json = await res.json().catch(() => null);

    const translated =
      json?.responseData?.translatedText &&
      typeof json.responseData.translatedText === "string"
        ? json.responseData.translatedText
        : original;

    return {
      originalText: original,
      translatedText: translated,
      detectedLanguage,
      translatedLanguage: targetLanguage,
    };
  } catch (error) {
    console.error("Translation failed:", error?.message);

    return {
      originalText: original,
      translatedText: original,
      detectedLanguage,
      translatedLanguage: targetLanguage,
    };
  }
}