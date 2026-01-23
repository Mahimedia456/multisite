import { SiteFooter } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

const FALLBACK_FOOTER = {
  name: "PetCare+",
  logoType: "emoji",
  logoValue: "✨",
  logoUrl: "",
  description: "",
  socials: [],
  columns: [],
  bottomLeft: "",
  bottomCenter: "",
  bottomRight: "",
};

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeFooter(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    ...raw,
    name: raw.name ?? "",
    logoType: raw.logoType ?? "emoji",
    logoValue: raw.logoValue ?? "✨",
    logoUrl: raw.logoUrl ?? "",
    description: raw.description ?? "",
    socials: safeArr(raw.socials)
      .map((s) => ({
        label: String(s?.label ?? "").trim(),
        href: String(s?.href ?? "").trim(),
      }))
      .filter((s) => s.label && s.href),
    columns: safeArr(raw.columns).map((c) => ({
      title: String(c?.title ?? "").trim(),
      description: String(c?.description ?? ""),
      type: String(c?.type ?? ""),
      cta:
        c?.cta && c.cta.label
          ? { label: String(c.cta.label), href: String(c.cta.href || "#") }
          : null,
      rating:
        c?.rating && c.rating.value
          ? { value: String(c.rating.value), count: String(c.rating.count || "") }
          : null,
      links: safeArr(c?.links)
        .map((l) => ({
          label: String(l?.label ?? "").trim(),
          href: String(l?.href ?? "").trim(),
        }))
        .filter((l) => l.label && l.href),
    })),
    bottomLeft: raw.bottomLeft ?? "",
    bottomCenter: raw.bottomCenter ?? "",
    bottomRight: raw.bottomRight ?? "",
  };
}

export default function Footer({ brandSlug = "aamir" }) {
  const { footer, loading, err } = useBrandLayout(brandSlug);
  const normalized = normalizeFooter(footer);

  if (loading) return <SiteFooter brand={FALLBACK_FOOTER} />;
  if (err || !normalized) return <SiteFooter brand={FALLBACK_FOOTER} />;

  return <SiteFooter brand={normalized} />;
}
