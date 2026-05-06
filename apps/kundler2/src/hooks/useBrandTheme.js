import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://multisite-server-api.vercel.app"
).replace(/\/+$/, "");

function normalizeHex(hex) {
  const clean = String(hex || "").replace("#", "").trim();

  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (/^[0-9a-fA-F]{6}$/.test(clean)) return clean;

  return "";
}

function hexToRgb(hex, fallback) {
  const clean = normalizeHex(hex);
  if (!clean) return fallback;

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `${r} ${g} ${b}`;
}

function setVar(name, value) {
  if (!value) return;
  document.documentElement.style.setProperty(name, value);
}

export function useBrandTheme(brandSlug) {
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadTheme() {
      try {
        const res = await fetch(
          `${API_BASE}/api/public/brands/${brandSlug}/theme?t=${Date.now()}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          console.warn("[useBrandTheme] Failed to load theme", {
            brandSlug,
            status: res.status,
            json,
          });
          return;
        }

        const b = json.data?.brand || {};

        setVar("--primary", hexToRgb(b.primaryColor || b.accentColor, "245 196 0"));
        setVar("--primary-dark", hexToRgb(b.primaryDarkColor || b.primaryColor || b.accentColor, "214 171 0"));
        setVar("--accent", hexToRgb(b.accentColor2 || b.accentColor || b.primaryColor, "245 196 0"));

        setVar("--bg-light", hexToRgb(b.backgroundLight, "246 247 248"));
        setVar("--bg-dark", hexToRgb(b.backgroundDark, "7 10 13"));
        setVar("--surface-light", hexToRgb(b.surfaceLight, "255 255 255"));
        setVar("--surface-dark", hexToRgb(b.surfaceDark, "28 42 41"));

        setVar("--allianz-blue", hexToRgb(b.primaryColor || "#003781", "0 55 129"));
        setVar("--text-dark", "11 15 18");

        if (b.fontGoogleUrl && !document.querySelector(`[data-brand-font="${brandSlug}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = b.fontGoogleUrl;
          link.dataset.brandFont = brandSlug;
          document.head.appendChild(link);
        }

        if (b.iconFontUrl && !document.querySelector(`[data-brand-icons="${brandSlug}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = b.iconFontUrl;
          link.dataset.brandIcons = brandSlug;
          document.head.appendChild(link);
        }

        if (b.fontFamily) {
          const fontStack = `"${b.fontFamily}", ui-sans-serif, system-ui`;
          document.documentElement.style.setProperty("--brand-font", fontStack);
          document.body.style.fontFamily = fontStack;
        }

        if (alive) setBrand(b);
      } catch (e) {
        console.warn("[useBrandTheme] Theme load error:", e?.message || e);
      }
    }

    if (brandSlug) loadTheme();

    return () => {
      alive = false;
    };
  }, [brandSlug]);

  return brand;
}