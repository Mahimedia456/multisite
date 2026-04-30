export async function translateText({ text, from = "de", to = "en" }) {
  const original = String(text || "").trim();

  if (!original) {
    return {
      originalText: "",
      translatedText: "",
      detectedLanguage: from,
      translatedLanguage: to,
    };
  }

  try {
    const langPair = `${from}|${to}`;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      original
    )}&langpair=${encodeURIComponent(langPair)}`;

    const res = await fetch(url);
    const json = await res.json().catch(() => null);

    const translated =
      typeof json?.responseData?.translatedText === "string"
        ? json.responseData.translatedText
        : original;

    return {
      originalText: original,
      translatedText: translated,
      detectedLanguage: from,
      translatedLanguage: to,
    };
  } catch (error) {
    console.error("Translation failed:", error?.message);

    return {
      originalText: original,
      translatedText: original,
      detectedLanguage: from,
      translatedLanguage: to,
    };
  }
}