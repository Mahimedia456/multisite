import { useEffect, useState } from "react";
import { AboutPage } from "@multisite/ui-inner-shared";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "../lib/useSharedPage";

export default function About() {
  const [config, setConfig] = useState(null);
  const { content, loading } = useSharedPage("about");

  useEffect(() => {
    const c = getTenantConfig("aamir"); // ✅ sync
    if (c?.primary) document.documentElement.style.setProperty("--brand", c.primary);
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  return (
    <AboutPage
      tenantConfig={config}
      HeaderSlot={Header}
      FooterSlot={Footer}
      content={content}
    />
  );
}
