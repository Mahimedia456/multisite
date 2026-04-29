import { useParams } from "react-router-dom";
import DropbrandUniquePageRenderer from "../components/unique-pages/DropbrandUniquePageRenderer";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";

const BRAND_SLUG = "dropbrand";

export default function UniquePage() {
  const { slug } = useParams();
  const pageSlug = slug || "home";

  const { content, loading, error } = useBrandUniquePage(BRAND_SLUG, pageSlug);
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light py-24 text-center text-zinc-500">
        Loading page...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light py-24 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <DropbrandUniquePageRenderer
      brandSlug={BRAND_SLUG}
      pageSlug={pageSlug}
      sections={sections}
      showHeader
      showFooter
    />
  );
}