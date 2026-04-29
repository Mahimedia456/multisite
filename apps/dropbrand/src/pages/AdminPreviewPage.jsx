import { useParams, useSearchParams } from "react-router-dom";
import DropbrandHomeRenderer from "../components/home/DropbrandHomeRenderer";
import { useBrandUniquePagePreview } from "../hooks/useBrandUniquePagePreview";

const BRAND_SLUG = "dropbrand";

export default function AdminPreviewPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const pageId = searchParams.get("pageId");

  const { content, loading, error } = useBrandUniquePagePreview({
    brandSlug: BRAND_SLUG,
    pageSlug: slug || "home",
    pageId,
  });

  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light py-24 text-center text-zinc-500">
        Loading preview...
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
    <DropbrandHomeRenderer
      brandSlug={BRAND_SLUG}
      sections={sections}
      showHeader
      showFooter
    />
  );
}