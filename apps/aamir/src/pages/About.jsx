import { useEffect, useState } from "react";
import { AboutPage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "../hooks/useSharedPage";

export default function About() {
  const [config, setConfig] = useState(null);
  const { content, loading, error } = useSharedPage("about");

  useEffect(() => {
    const c = getTenantConfig("petcare");
    if (c?.primary) {
      document.documentElement.style.setProperty("--brand", c.primary);
    }
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h3 style={{ color: "red" }}>Shared page load failed</h3>
        <pre>{String(error)}</pre>
      </div>
    );
  }

  return (
    <AboutPage
      tenantConfig={config}
      HeaderSlot={() => <Header brandSlug="aamir" />}
      FooterSlot={() => <Footer brandSlug="aamir" />}
      content={content}
    />
  );
}
