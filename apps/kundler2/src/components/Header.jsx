import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

function hrefToVisibilityKey(href = "") {
  const clean = String(href || "").split("?")[0].split("#")[0];

  if (clean === "/" || clean === "") return { type: "unique", slug: "home" };
  if (clean === "/about") return { type: "unique", slug: "about" };
  if (clean === "/contact") return { type: "unique", slug: "contact" };

  if (clean === "/kfz-versicherung") {
    return { type: "shared", slug: "kfz-versicherung" };
  }

  if (clean === "/e-auto-versicherung") {
    return { type: "shared", slug: "e-auto-versicherung" };
  }

  return null;
}

function filterLinks(links, isHidden) {
  if (!Array.isArray(links)) return links;

  return links
    .map((link) => {
      const href = link?.href || link?.path || link?.url || "";
      const key = hrefToVisibilityKey(href);

      if (key && isHidden(key.type, key.slug)) return null;

      const next = { ...link };

      if (Array.isArray(next.children)) {
        next.children = filterLinks(next.children, isHidden);
      }

      if (Array.isArray(next.items)) {
        next.items = filterLinks(next.items, isHidden);
      }

      if (Array.isArray(next.links)) {
        next.links = filterLinks(next.links, isHidden);
      }

      return next;
    })
    .filter(Boolean);
}

function normalizeHeaderVisibility(header, isHidden) {
  if (!header || typeof header !== "object") return header;

  const next = { ...header };

  for (const key of ["nav", "navLinks", "links", "items", "menu", "menus"]) {
    if (Array.isArray(next[key])) {
      next[key] = filterLinks(next[key], isHidden);
    }
  }

  return next;
}

export default function Header({ brandSlug = "kundler3" }) {
  const { header, loading } = useBrandLayout(brandSlug);
  const { loading: settingsLoading, isHidden } = useWebsiteSettings(brandSlug);

  if (loading || settingsLoading) return null;
  if (!header) return null;

  const filteredHeader = normalizeHeaderVisibility(header, isHidden);

  return <SiteHeader brand={filteredHeader} />;
}