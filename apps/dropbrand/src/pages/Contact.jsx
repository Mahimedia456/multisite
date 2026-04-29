import DropbrandContactRenderer from "../components/contact/DropbrandContactRenderer";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";

export default function Contact() {
  const { content, loading, error } = useBrandUniquePage("dropbrand", "contact");
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

  return <DropbrandContactRenderer brandSlug="dropbrand" sections={sections} />;
}