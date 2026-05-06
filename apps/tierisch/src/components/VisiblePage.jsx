import BrandLoader from "./BrandLoader";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

export default function VisiblePage({
  brandSlug,
  type = "unique",
  slug,
  children,
}) {
  const { loading, isHidden } = useWebsiteSettings(brandSlug);

  if (loading) return <BrandLoader />;

  if (isHidden(type, slug)) {
    return (
      <main className="min-h-screen grid place-items-center bg-white px-6 text-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Seite ist aktuell nicht verfügbar
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Diese Seite wurde für diese Marke deaktiviert.
          </p>
        </div>
      </main>
    );
  }

  return children;
}