import Header from "../Header";
import Footer from "../Footer";

import ContactHeroSection from "../../sections/contact/ContactHeroSection";
import ContactInfoSection from "../../sections/contact/ContactInfoSection";
import ContactFormSection from "../../sections/contact/ContactFormSection";
import ContactFAQSection from "../../sections/contact/ContactFAQSection";

const SECTION_MAP = {
  ContactHeroSection,
  ContactInfoSection,
  ContactFormSection,
  ContactFAQSection,
};

export default function KundlerContactRenderer({
  brandSlug = "kundler3",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  return (
    <main className="min-h-screen bg-white text-[#0b0f12] overflow-x-hidden antialiased">
      {showHeader ? <Header brandSlug={brandSlug} /> : null}

      {sections.map((section) => {
        if (section?.hidden) return null;

        const Comp = SECTION_MAP[section.type];
        if (!Comp) return null;

        return (
          <div key={section.id} data-section-id={section.id}>
            <Comp brandSlug={brandSlug} {...(section.props || {})} />
          </div>
        );
      })}

      {showFooter ? <Footer brandSlug={brandSlug} /> : null}
    </main>
  );
}