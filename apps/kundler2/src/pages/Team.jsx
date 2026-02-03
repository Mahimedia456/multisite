import { useEffect, useState } from "react";
import { TeamPage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "../hooks/useSharedPage";

export default function Team() {
  const [config, setConfig] = useState(null);
  const { content, loading, error } = useSharedPage("team");

  useEffect(() => {
    const c = getTenantConfig("kundler3"); // ✅ IMPORTANT
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
    <TeamPage
      tenantConfig={config}
      HeaderSlot={() => <Header brandSlug="kundler3" />} // ✅
      FooterSlot={() => <Footer brandSlug="kundler3" />} // ✅
      content={content}
    />
  );
}
