import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

const FALLBACK = {
  name: "PetCare+",
  logoType: "material",
  logoValue: "pets",
  homeLinks: [
    { label: "Plans", href: "/#plans" },
    { label: "How it Works", href: "/#how" },
    { label: "Claims", href: "/#claims" },
  ],
  login: { label: "Log In", to: "/login" },
  cta: { label: "Get a Quote", href: "/quote" },
};

export default function Header() {
  const { header } = useBrandLayout("umair"); // ✅ brand slug

  // UI same: we just swap data
  return <SiteHeader brand={header || FALLBACK} />;
}
