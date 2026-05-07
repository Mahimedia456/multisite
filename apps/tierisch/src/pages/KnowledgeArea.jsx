import { useEffect, useState } from "react";
import { KnowledgeAreaPage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getTenantConfig } from "@multisite/sdk";
import { useBrandKnowledge } from "../hooks/useBrandKnowledge";

export default function KnowledgeArea() {
  const [config, setConfig] = useState(null);

  // ✅ knowledge hook
  const knowledge = useBrandKnowledge("allianz4");

  useEffect(() => {
    const c = getTenantConfig("allianz4");

    if (c?.primary) {
      document.documentElement.style.setProperty("--brand", c.primary);
    }

    setConfig(c);
  }, []);

  if (!config || knowledge.loading) return null;

  if (knowledge.error) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "red" }}>Knowledge area load failed</h2>
        <pre>{String(knowledge.error)}</pre>
      </div>
    );
  }

  return (
    <KnowledgeAreaPage
      tenantConfig={config}
      brandSlug="allianz4"
      lang="de"
      HeaderSlot={() => <Header brandSlug="allianz4" />}
      FooterSlot={() => <Footer brandSlug="allianz4" />}

      // ✅ hook data
      categories={knowledge.categories}
      articles={knowledge.articles}
      faqs={knowledge.faqs}
      forms={knowledge.forms}
      settings={knowledge.settings}
    />
  );
}