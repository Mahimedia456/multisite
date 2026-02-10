import { useEffect, useState } from "react";
import { EAautoVersicherungPage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "../hooks/useSharedPage";

export default function EAautoVersicherung() {
  const [config, setConfig] = useState(null);

  // slug you want in CMS/shared: "e-auto-versicherung"
  const { content, loading, error } = useSharedPage("e-auto-versicherung");

  useEffect(() => {
    const c = getTenantConfig("allianz4"); // ✅ tenant slug here
    if (c?.primary) document.documentElement.style.setProperty("--brand", c.primary);
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "red" }}>Shared page load failed</h2>
        <pre>{String(error)}</pre>
      </div>
    );
  }

  return (
    <EAautoVersicherungPage
      tenantConfig={config}
      HeaderSlot={() => <Header brandSlug="allianz4" />}
      FooterSlot={() => <Footer brandSlug="allianz4" />}
      content={content}
    />
  );
}
