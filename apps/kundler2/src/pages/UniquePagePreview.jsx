import { useParams, useSearchParams } from "react-router-dom";
import BrandLoader from "../components/BrandLoader";
import KundlerHomeRenderer from "../components/home/KundlerHomeRenderer";
import KundlerAboutRenderer from "../components/about/KundlerAboutRenderer";
import KundlerContactRenderer from "../components/contact/KundlerContactRenderer";
import { useBrandUniquePagePreview } from "../hooks/useBrandUniquePagePreview";

export default function UniquePagePreview() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const pageId = searchParams.get("pageId") || "";
  const pageSlug = slug || "home";

  const { content, loading, error } = useBrandUniquePagePreview({
    pageId,
    pageSlug,
    brandSlug: "kundler3",
  });

  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) return <BrandLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-600 font-bold">
        {error}
      </div>
    );
  }

  if (pageSlug === "about") {
    return (
      <KundlerAboutRenderer
        brandSlug="kundler3"
        sections={sections}
        showHeader={false}
        showFooter={false}
      />
    );
  }

  if (pageSlug === "contact") {
    return (
      <KundlerContactRenderer
        brandSlug="kundler3"
        sections={sections}
        showHeader={false}
        showFooter={false}
      />
    );
  }

  return (
    <KundlerHomeRenderer
      brandSlug="kundler3"
      sections={sections}
      showHeader={false}
      showFooter={false}
    />
  );
}