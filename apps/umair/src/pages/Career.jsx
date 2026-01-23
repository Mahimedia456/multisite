import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "../hooks/useSharedPage";

// If you added CareerPage in ui-inner-shared:
import { CareerPage } from "@multisite/ui-inner-shared";
// If not, import local CareerPage instead.

export default function Career() {
  const [config, setConfig] = useState(null);
  const { content, loading, error } = useSharedPage("career");

  useEffect(() => {
    const c = getTenantConfig("aamir");
    if (c?.primary) document.documentElement.style.setProperty("--brand", c.primary);
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "red" }}>Shared page load failed</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  return <CareerPage tenantConfig={config} HeaderSlot={Header} FooterSlot={Footer} content={content} />;
}
