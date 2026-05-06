import { useParams, useSearchParams } from "react-router-dom";
import BrandLoader from "../components/BrandLoader";

import TierischHomeRenderer from "../components/renderers/TierischHomeRenderer";
import TierischAboutRenderer from "../components/renderers/TierischAboutRenderer";
import TierischContactRenderer from "../components/renderers/TierischContactRenderer";

import { useBrandUniquePagePreview } from "../hooks/useBrandUniquePagePreview";

const BRAND = "allianz4";

export default function UniquePagePreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const pageSlug = slug || "home";
  const pageId = searchParams.get("pageId") || "";

  const { content, loading, error } = useBrandUniquePagePreview({
    brandSlug: BRAND,
    pageSlug,
    pageId,
  });

  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) return <BrandLoader />;

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center bg-white text-center px-6">
        <div>
          <h1 className="text-lg font-extrabold text-red-600">
            Preview konnte nicht geladen werden
          </h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </main>
    );
  }

  if (pageSlug === "about") {
    return (
      <TierischAboutRenderer
        brandSlug={BRAND}
        sections={sections}
        showHeader={false}
        showFooter={false}
      />
    );
  }

  if (pageSlug === "contact") {
    return (
      <TierischContactRenderer
        brandSlug={BRAND}
        sections={sections}
        showHeader={false}
        showFooter={false}
      />
    );
  }

  return (
    <TierischHomeRenderer
      brandSlug={BRAND}
      sections={sections}
      showHeader={false}
      showFooter={false}
    />
  );
}