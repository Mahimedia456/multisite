// packages/ui-inner-shared/src/pages/EAautoVersicherungPage.jsx
import StickyHeader from "../sections/about/StickyHeader";
import LocalFooter from "../sections/about/Footer";

// Sections
import Hero from "../sections/eauto/Hero";
import QuickStats from "../sections/eauto/QuickStats";
import TarifeVergleich from "../sections/eauto/TarifeVergleich";
import Offers from "../sections/eauto/Offers";
import Zusatzbausteine from "../sections/eauto/Zusatzbausteine";
import WasIstVersichert from "../sections/eauto/WasIstVersichert";
import FAQ from "../sections/eauto/FAQ";

export default function EAautoVersicherungPage({
  tenantConfig,
  HeaderSlot,
  FooterSlot,
  content,
}) {
  const sections = Array.isArray(content?.sections)
    ? content.sections
    : [
        { type: "Hero", props: {} },
        { type: "QuickStats", props: {} },
        { type: "TarifeVergleich", props: {} },
        { type: "Offers", props: {} },
        { type: "Zusatzbausteine", props: {} },
        { type: "WasIstVersichert", props: {} },
        { type: "FAQ", props: {} },
      ];

  const renderSection = (s, i) => {
    const p = s?.props || {};
    switch (s?.type) {
      case "Hero":
        return <Hero key={i} {...p} />;
      case "QuickStats":
        return <QuickStats key={i} {...p} />;
      case "TarifeVergleich":
        return <TarifeVergleich key={i} {...p} />;
      case "Offers":
        return <Offers key={i} {...p} />;
      case "Zusatzbausteine":
        return <Zusatzbausteine key={i} {...p} />;
      case "WasIstVersichert":
        return <WasIstVersichert key={i} {...p} />;
      case "FAQ":
        return <FAQ key={i} {...p} />;
      default:
        return null;
    }
  };

  return (
    <>
      {HeaderSlot ? (
        <HeaderSlot tenant={tenantConfig} />
      ) : (
        <StickyHeader tenant={tenantConfig} />
      )}

      <main className="flex-1 flex flex-col items-center bg-[#f5f8f5]">
        <div className="w-full max-w-[1200px] px-6">
          {sections.map(renderSection)}
        </div>
      </main>

      {FooterSlot ? (
        <FooterSlot tenant={tenantConfig} />
      ) : (
        <LocalFooter tenant={tenantConfig} />
      )}
    </>
  );
}
