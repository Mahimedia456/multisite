import { SiteFooter } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeFooter(raw) {
  if (!raw || typeof raw !== "object") return null;

  const socials = safeArr(raw.socials)
    .map((s) => ({
      label: String(s?.label ?? "").trim(),
      href: String(s?.href ?? "").trim(),
    }))
    .filter((s) => s.label && s.href);

  const columns = safeArr(raw.columns).map((c) => ({
    title: String(c?.title ?? "").trim(),
    description: c?.description ?? "",
    type: c?.type ?? "",
    cta: c?.cta?.label ? { label: c.cta.label, href: c.cta.href || "#" } : null,
    rating: c?.rating?.value ? { value: c.rating.value, count: c.rating.count || "" } : null,
    links: safeArr(c?.links)
      .map((l) => ({
        label: String(l?.label ?? "").trim(),
        href: String(l?.href ?? "").trim(),
      }))
      .filter((l) => l.label && l.href),
  }));

  return {
    ...raw,
    name: raw.name ?? "",
    logoType: raw.logoType ?? "emoji",
    logoValue: raw.logoValue ?? "✨",
    logoUrl: raw.logoUrl ?? "",
    description: raw.description ?? "",
    socials,
    columns,
    bottomLeft: raw.bottomLeft ?? "",
    bottomCenter: raw.bottomCenter ?? "",
    bottomRight: raw.bottomRight ?? "",
  };
}

export default function Footer() {
  const { footer, loading, err } = useBrandLayout("allianz4");

  // ✅ no flash
  if (loading) return null;

  // ❌ no fallback
  if (err || !footer) return null;

  const normalized = normalizeFooter(footer);
  if (!normalized) return null;

  return <SiteFooter brand={normalized} />;
}
