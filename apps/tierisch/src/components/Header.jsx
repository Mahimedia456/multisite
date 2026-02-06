import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

export default function Header() {
  const { header, loading } = useBrandLayout("allianz4"); // brand slug

  // ⏳ optional: loading state (agar hook provide karta hai)
  if (loading) return null;

  // ❌ no fallback — agar header nahi mila, kuch render hi nahi
  if (!header) return null;

  return <SiteHeader brand={header} />;
}
