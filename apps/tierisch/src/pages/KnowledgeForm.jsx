import { useEffect, useState } from "react";
import { KnowledgeFormPage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getTenantConfig } from "@multisite/sdk";

export default function KnowledgeForm() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const c = getTenantConfig("allianz4");

    if (c?.primary) {
      document.documentElement.style.setProperty("--brand", c.primary);
    }

    setConfig(c);
  }, []);

  if (!config) return null;

  return (
    <KnowledgeFormPage
      tenantConfig={config}
      brandSlug="allianz4"
      lang="de"
      HeaderSlot={() => <Header brandSlug="allianz4" />}
      FooterSlot={() => <Footer brandSlug="allianz4" />}
    />
  );
}