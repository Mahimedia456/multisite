import BrandLoader from "../components/BrandLoader";
import TierischHomeRenderer from "../components/renderers/TierischHomeRenderer";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";

export default function Home() {
  const { content, loading, error } = useBrandUniquePage("allianz4", "home");
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) return <BrandLoader />;

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-white px-6 text-center">
        <div>
          <div className="text-lg font-extrabold text-red-600">
            Seite konnte nicht geladen werden
          </div>
          <div className="mt-2 text-sm text-slate-500">{error}</div>
        </div>
      </div>
    );
  }

  return <TierischHomeRenderer brandSlug="allianz4" sections={sections} />;
}