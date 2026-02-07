import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

export default function Header() {
  const { header, loading, err } = useBrandLayout("allianz4");

  // ⏳ no flash
  if (loading) return null;

  // ❌ no fallback — if API fails / empty data, render nothing
  if (err || !header) return null;

  return <SiteHeader brand={header} />;
}
