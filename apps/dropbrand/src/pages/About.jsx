import DropbrandAboutRenderer from "../components/about/DropbrandAboutRenderer";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";

export default function About() {
  const { content, loading, error } = useBrandUniquePage("dropbrand", "about");
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

  return <DropbrandAboutRenderer brandSlug="dropbrand" sections={sections} />;
}