import BrandLoader from "../components/BrandLoader";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";
import KundlerAboutRenderer from "../components/about/KundlerAboutRenderer";

export default function About() {
  const { content, loading, error } = useBrandUniquePage("kundler3", "about");
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) return <BrandLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-bold">{error}</div>
      </div>
    );
  }

  return <KundlerAboutRenderer sections={sections} />;
}