// src/pages/About.jsx
import { useEffect, useState } from "react";
import { AboutPage } from "@multisite/ui-inner-shared";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";

// ✅ FIX: correct path (hooks)
import { useSharedPage } from "../lib/useSharedPage";

export default function About() {
  const [config, setConfig] = useState(null);

  // slug must match DB: brand_shared_pages.slug = "about"
  const { content, loading, error } = useSharedPage("about");

  useEffect(() => {
    const c = getTenantConfig("aamir");
    if (c?.primary) document.documentElement.style.setProperty("--brand", c.primary);
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  // ✅ if API error show something (helps debug)
  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ color: "red", fontWeight: 700 }}>Shared page load failed:</div>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
      </div>
    );
  }

  return (
    <AboutPage
      tenantConfig={config}
      HeaderSlot={Header}
      FooterSlot={Footer}
      content={content}
    />
  );
}
