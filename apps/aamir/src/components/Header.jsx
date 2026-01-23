import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

const FALLBACK = {
  name: "PetCare+",
  logoType: "material",
  logoValue: "pets",
  logoUrl: "",
  homeLinks: [
    { label: "Plans", href: "/#plans" },
    { label: "How it Works", href: "/#how" },
    { label: "Claims", href: "/#claims" },
  ],
  login: { label: "Log In", href: "/login" },
  cta: { label: "Get a Quote", href: "/quote" },
};

function normalizeHeader(raw) {
  if (!raw || typeof raw !== "object") return null;

  // ✅ Convert {to} -> {href} and remove invalid links
  const homeLinks = (Array.isArray(raw.homeLinks) ? raw.homeLinks : [])
    .map((l) => {
      const href =
        (typeof l?.href === "string" && l.href.trim()) ||
        (typeof l?.to === "string" && l.to.trim()) ||
        "";
      const label = (l?.label ?? "").trim();
      return { label, href };
    })
    .filter((l) => l.label && l.href); // only valid

  const loginHref =
    (typeof raw?.login?.href === "string" && raw.login.href.trim()) ||
    (typeof raw?.login?.to === "string" && raw.login.to.trim()) ||
    "";

  const ctaHref =
    (typeof raw?.cta?.href === "string" && raw.cta.href.trim()) ||
    (typeof raw?.cta?.to === "string" && raw.cta.to.trim()) ||
    "";

  return {
    ...raw,
    name: raw.name ?? "",
    logoType: raw.logoType ?? "material",
    logoValue: raw.logoValue ?? "",
    logoUrl: raw.logoUrl ?? "",
    homeLinks, // ✅ clean menu (no default inject)
    login: {
      label: raw?.login?.label ?? "",
      href: loginHref,
    },
    cta: {
      label: raw?.cta?.label ?? "",
      href: ctaHref,
    },
  };
}

export default function Header() {
  const { header, loading, err } = useBrandLayout("aamir");

  const normalized = normalizeHeader(header);

  // Page load pe header visible rahe
  if (loading) return <SiteHeader brand={FALLBACK} />;
  if (err || !normalized) return <SiteHeader brand={FALLBACK} />;

  return <SiteHeader brand={normalized} />;
}
