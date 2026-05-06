import Header from "../Header";
import Footer from "../Footer";

import ContactHero from "../tierisch/contact/ContactHero";
import ContactInfo from "../tierisch/contact/ContactInfo";
import ContactForm from "../tierisch/contact/ContactForm";
import ContactMap from "../tierisch/contact/ContactMap";
import ContactFAQ from "../tierisch/contact/ContactFAQ";

const SECTION_MAP = {
  ContactHero,
  ContactInfo,
  ContactForm,
  ContactMap,
  ContactFAQ,
};

export default function TierischContactRenderer({
  brandSlug = "allianz4",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  return (
    <main className="bg-background-light text-slate-900">
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
      <div className="h-10" />
    </main>
  );
}