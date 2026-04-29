import Header from "../Header";
import Footer from "../Footer";

import ContactHeroSection from "./sections/ContactHeroSection";
import ContactInfoSection from "./sections/ContactInfoSection";
import ContactFormSection from "./sections/ContactFormSection";
import ContactFAQSection from "./sections/ContactFAQSection";

const SECTION_MAP = {
  ContactHeroSection,
  ContactInfoSection,
  ContactFormSection,
  ContactFAQSection,
};

export default function DropbrandContactRenderer({
  brandSlug = "dropbrand",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  return (
    <main className="min-h-screen bg-background-light text-slate-900 overflow-x-hidden">
      {showHeader ? <Header brandSlug={brandSlug} /> : null}

      {sections.map((section) => {
        if (section?.hidden) return null;

        const Comp = SECTION_MAP[section.type];
        if (!Comp) return null;

        return (
          <div key={section.id} data-section-id={section.id}>
            <Comp {...(section.props || {})} />
          </div>
        );
      })}

      {showFooter ? <Footer brandSlug={brandSlug} /> : null}
    </main>
  );
}