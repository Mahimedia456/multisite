import { useEffect, useState } from "react";
import { CareerPage } from "@multisite/ui-inner-shared";
import { getTenantConfig } from "@multisite/sdk";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSharedPage } from "../hooks/useSharedPage";

const BRAND = "dropbrand";

export default function Career() {
  const [config, setConfig] = useState(null);
  const { content, loading, error } = useSharedPage("career");

  useEffect(() => {
    const c = getTenantConfig(BRAND);
    document.documentElement.style.setProperty("--brand", c?.primary || "#0f4a2c");
    setConfig(c);
  }, []);

  if (!config || loading) return null;
  if (error) return <pre style={{ padding: 24 }}>{error}</pre>;

  return (
    <CareerPage
      tenantConfig={config}
      HeaderSlot={() => <Header brandSlug={BRAND} />}
      FooterSlot={() => <Footer brandSlug={BRAND} />}
      content={content}
    />
  );
}