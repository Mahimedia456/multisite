import BrandLoader from "../components/BrandLoader";
import TierischContactRenderer from "../components/renderers/TierischContactRenderer";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";

export default function Contact() {
  const { content, loading, error } = useBrandUniquePage("allianz4", "contact");
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

  return <TierischContactRenderer brandSlug="allianz4" sections={sections} />;
}