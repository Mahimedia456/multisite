import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

export default function Header({ brandSlug = "allianz4" }) {
  const { header, loading } = useBrandLayout(brandSlug);
  const { items, loading: settingsLoading, isHidden } = useWebsiteSettings(brandSlug);

  if (loading || settingsLoading) return null;
  if (!header) return null;

  const hiddenWebsitePages = (items || [])
    .filter((x) => x.is_visible === false && x.slug)
    .map((x) => `${x.page_type}:${x.slug}`);

  return (
    <SiteHeader
      brand={header}
      hiddenWebsitePages={hiddenWebsitePages}
      showDefaultAbout={!isHidden("unique", "about")}
    />
  );
}