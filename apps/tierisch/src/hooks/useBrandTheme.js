import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://multisite-server-api.vercel.app"
).replace(/\/+$/, "");

function normalizeHex(hex) {
  const clean = String(hex || "").replace("#", "").trim();

  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return clean.split("").map((c) => c + c).join("");
  }

  if (/^[0-9a-fA-F]{6}$/.test(clean)) return clean;

  return "";
}

function hexToRgb(hex, fallback) {
  const clean = normalizeHex(hex);
  if (!clean) return fallback;

  return `${parseInt(clean.slice(0, 2), 16)} ${parseInt(
    clean.slice(2, 4),
    16
  )} ${parseInt(clean.slice(4, 6), 16)}`;
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
          `${API_BASE}/public/brands/${brandSlug}/theme?t=${Date.now()}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          console.warn("[useBrandTheme] Failed", { status: res.status, json });
          return;
        }

        const b = json.data?.brand || {};

        setVar("--primary", hexToRgb(b.primaryColor || b.accentColor, "0 147 143"));
        setVar("--primary-dark", hexToRgb(b.primaryDarkColor || b.primaryColor || b.accentColor, "0 124 121"));
        setVar("--accent", hexToRgb(b.accentColor2 || b.accentColor || b.primaryColor, "0 147 143"));

        setVar("--bg-light", hexToRgb(b.backgroundLight, "246 248 251"));
        setVar("--bg-dark", hexToRgb(b.backgroundDark, "15 23 42"));
        setVar("--surface-light", hexToRgb(b.surfaceLight, "255 255 255"));
        setVar("--surface-dark", hexToRgb(b.surfaceDark, "30 41 59"));
        setVar("--text-dark", "15 23 42");

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

        document.body.dataset.brand = brandSlug;

        if (alive) setBrand(b);
      } catch (e) {
        console.warn("[useBrandTheme] error:", e?.message || e);
      }
    }

    if (brandSlug) loadTheme();

    return () => {
      alive = false;
    };
  }, [brandSlug]);

  return brand;
}