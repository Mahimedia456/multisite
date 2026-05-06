import BrandLoader from "./BrandLoader";
import Header from "./Header";
import Footer from "./Footer";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

export default function VisiblePage({
  brandSlug = "kundler3",
  type,
  slug,
  children,
}) {
  const { loading, isHidden } = useWebsiteSettings(brandSlug);

  if (loading) return <BrandLoader duration={800} />;

  if (isHidden(type, slug)) {
    return (
      <main className="min-h-screen bg-white text-[#0b0f12]">
        <Header brandSlug={brandSlug} />

        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-black/40">
            Seite nicht verfügbar
          </div>

          <h1 className="mt-4 text-4xl font-black">
            Diese Seite ist aktuell deaktiviert.
          </h1>

          <p className="mt-4 text-base leading-7 text-black/60">
            Bitte kehren Sie zur Startseite zurück oder kontaktieren Sie die Agentur.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-black text-white"
          >
            Zur Startseite
          </a>
        </section>

        <Footer brandSlug={brandSlug} />
      </main>
    );
  }

  return children;
}