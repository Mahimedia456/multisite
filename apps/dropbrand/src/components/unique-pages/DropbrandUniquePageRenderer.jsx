import DropbrandHomeRenderer from "../home/DropbrandHomeRenderer";
import DropbrandAboutRenderer from "../about/DropbrandAboutRenderer";
import DropbrandContactRenderer from "../contact/DropbrandContactRenderer";

export default function DropbrandUniquePageRenderer({
  brandSlug = "dropbrand",
  pageSlug = "home",
  sections = [],
  showHeader = true,
  showFooter = true,
}) {
  if (pageSlug === "about") {
    return (
      <DropbrandAboutRenderer
        brandSlug={brandSlug}
        sections={sections}
        showHeader={showHeader}
        showFooter={showFooter}
      />
    );
  }

  if (pageSlug === "contact") {
    return (
      <DropbrandContactRenderer
        brandSlug={brandSlug}
        sections={sections}
        showHeader={showHeader}
        showFooter={showFooter}
      />
    );
  }

  return (
    <DropbrandHomeRenderer
      brandSlug={brandSlug}
      sections={sections}
      showHeader={showHeader}
      showFooter={showFooter}
    />
  );
}