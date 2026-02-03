import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

const FALLBACK = {
  name: "Kundler 3",
  logoType: "material",
  logoValue: "apartment", // change if you want
  homeLinks: [
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  login: { label: "Log In", to: "/login" },
  cta: { label: "Get a Quote", href: "/quote" },
};

export default function Header({ brandSlug = "kundler3" }) {
  const { header } = useBrandLayout(brandSlug);

  return <SiteHeader brand={header || FALLBACK} />;
}
