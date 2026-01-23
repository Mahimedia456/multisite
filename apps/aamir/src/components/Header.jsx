import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

const FALLBACK_HEADER = {
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

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeHeader(raw) {
  if (!raw || typeof raw !== "object") return null;

  // ✅ Convert {to} -> {href} and remove invalid links
  const homeLinks = safeArr(raw.homeLinks)
    .map((l) => {
      const label = String(l?.label ?? "").trim();
      const href =
        (typeof l?.href === "string" && l.href.trim()) ||
        (typeof l?.to === "string" && l.to.trim()) ||
        "";
      return { label, href };
    })
    .filter((l) => l.label && l.href);

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
    logoValue: raw.logoValue ?? "pets",
    logoUrl: raw.logoUrl ?? "",
    homeLinks,
    login: {
      label: raw?.login?.label ?? "Log In",
      href: loginHref || "/login",
    },
    cta: {
      label: raw?.cta?.label ?? "Get a Quote",
      href: ctaHref || "/quote",
    },
  };
}

export default function Header({ brandSlug = "aamir" }) {
  const { header, loading, err } = useBrandLayout(brandSlug);
  const normalized = normalizeHeader(header);

  // ✅ no blank header
  if (loading) return <SiteHeader brand={FALLBACK_HEADER} />;
  if (err || !normalized) return <SiteHeader brand={FALLBACK_HEADER} />;

  return <SiteHeader brand={normalized} />;
}
