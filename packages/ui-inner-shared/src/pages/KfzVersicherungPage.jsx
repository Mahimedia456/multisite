import StickyHeader from "../sections/about/StickyHeader";
import LocalFooter from "../sections/about/Footer";

import Hero from "../sections/kfz/Hero";
import Vorteile from "../sections/kfz/Vorteile";
import Versicherungsarten from "../sections/kfz/Versicherungsarten";
import Zusatzbausteine from "../sections/kfz/Zusatzbausteine";
import Preisbeispiele from "../sections/kfz/Preisbeispiele";
import FAQ from "../sections/kfz/FAQ";
import AgencyCTA from "../sections/kfz/AgencyCTA";

import AutoReveal from "../components/AutoReveal";

export default function KfzVersicherungPage({ tenantConfig, HeaderSlot, FooterSlot, content }) {
  const sections = Array.isArray(content?.sections)
    ? content.sections
    : [
        { type: "Hero", props: {} },
        { type: "Vorteile", props: {} },
        { type: "Versicherungsarten", props: {} },
        { type: "Zusatzbausteine", props: {} },
        { type: "Preisbeispiele", props: {} },
        { type: "FAQ", props: {} },
        { type: "AgencyCTA", props: {} },
      ];

  const renderSection = (s, i) => {
    const p = s?.props || {};
    switch (s?.type) {
      case "Hero":
        return <Hero {...p} />;
      case "Vorteile":
        return <Vorteile {...p} />;
      case "Versicherungsarten":
        return <Versicherungsarten {...p} />;
      case "Zusatzbausteine":
        return <Zusatzbausteine {...p} />;
      case "Preisbeispiele":
        return <Preisbeispiele {...p} />;
      case "FAQ":
        return <FAQ {...p} />;
      case "AgencyCTA":
        return <AgencyCTA {...p} />;
      default:
        return null;
    }
  };

  return (
    <>
      {HeaderSlot ? <HeaderSlot tenant={tenantConfig} /> : <StickyHeader tenant={tenantConfig} />}

      <main className="bg-[#f5f8f8] text-slate-900">
        {sections.map((s, i) => {
          const node = renderSection(s, i);
          if (!node) return null;

          // ✅ optional: allow disabling reveal per section in CMS
          if (s?.reveal === false) return <div key={i}>{node}</div>;

          return (
            <AutoReveal key={i} index={i}>
              {node}
            </AutoReveal>
          );
        })}
      </main>

      {FooterSlot ? <FooterSlot tenant={tenantConfig} /> : <LocalFooter tenant={tenantConfig} />}
    </>
  );
}
