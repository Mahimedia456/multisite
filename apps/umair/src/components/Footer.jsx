import { SiteFooter } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

export default function Footer({ brandSlug = "umair" }) {
  const { footer, loading, err } = useBrandLayout(brandSlug);

  if (loading) return null;
  if (err || !footer) return null;

  return <SiteFooter brand={footer} />;
}