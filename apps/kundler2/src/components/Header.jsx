import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

function normalizePath(value = "") {
  let clean = String(value || "").trim();

  if (!clean) return "";

  try {
    if (clean.startsWith("http")) {
      clean = new URL(clean).pathname;
    }
  } catch {}

  clean = clean.split("?")[0].split("#")[0].trim();

  if (!clean.startsWith("/")) clean = `/${clean}`;
  clean = clean.replace(/\/+$/, "");

  return clean || "/";
}

function hrefToVisibilityKey(href = "", label = "") {
  const path = normalizePath(href);
  const text = String(label || "").toLowerCase().trim();

  if (path === "/") return { type: "unique", slug: "home" };

  if (path === "/about" || text === "über uns" || text === "about") {
    return { type: "unique", slug: "about" };
  }

  if (path === "/contact" || text === "kontakt") {
    return { type: "unique", slug: "contact" };
  }

  if (path === "/kfz-versicherung" || text.includes("kfz")) {
    return { type: "shared", slug: "kfz-versicherung" };
  }

  if (path === "/e-auto-versicherung" || text.includes("e-auto")) {
    return { type: "shared", slug: "e-auto-versicherung" };
  }

  return null;
}

function getHref(item) {
  return item?.href || item?.to || item?.url || item?.path || "";
}

function shouldHideItem(item, isHidden) {
  const key = hrefToVisibilityKey(getHref(item), item?.label || item?.title || "");

  if (!key) return false;

  return isHidden(key.type, key.slug);
}

function filterDeep(value, isHidden) {
  if (Array.isArray(value)) {
    return value
      .map((item) => filterDeep(item, isHidden))
      .filter(Boolean);
  }

  if (!value || typeof value !== "object") return value;

  if (shouldHideItem(value, isHidden)) return null;

  const next = { ...value };

  Object.keys(next).forEach((key) => {
    if (Array.isArray(next[key])) {
      next[key] = filterDeep(next[key], isHidden);
    }
  });

  return next;
}

export default function Header({ brandSlug = "kundler3" }) {
  const { header, loading } = useBrandLayout(brandSlug);
  const { loading: settingsLoading, isHidden } = useWebsiteSettings(brandSlug);

  if (loading || settingsLoading) return null;
  if (!header) return null;

  const filteredHeader = filterDeep(header, isHidden);

  return (
    <SiteHeader
      brand={filteredHeader}
      showDefaultAbout={!isHidden("unique", "about")}
    />
  );
}