import DropbrandHomeRenderer from "../components/home/DropbrandHomeRenderer";
import { useBrandUniquePage } from "../hooks/useBrandUniquePage";

export default function Home() {
  const { content, loading, error } = useBrandUniquePage("dropbrand", "home");
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  if (loading) {
    return <div className="py-24 text-center text-zinc-500">Loading page...</div>;
  }

  if (error) {
    return <div className="py-24 text-center text-red-600">{error}</div>;
  }

  return <DropbrandHomeRenderer brandSlug="dropbrand" sections={sections} />;
}