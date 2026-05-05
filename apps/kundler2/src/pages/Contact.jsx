import BrandLoader from "../components/BrandLoader";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";
import KundlerContactRenderer from "../components/contact/KundlerContactRenderer";

export default function Contact() {
  const { content, loading, error } = useBrandUniquePage("kundler3", "contact");
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) return <BrandLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div>
          <div className="text-lg font-extrabold text-red-600">
            Seite konnte nicht geladen werden
          </div>
          <div className="mt-2 text-sm text-black/60">{error}</div>
        </div>
      </div>
    );
  }

  return <KundlerContactRenderer brandSlug="kundler3" sections={sections} />;
}