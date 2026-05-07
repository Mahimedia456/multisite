import { useEffect, useState } from "react";
import { Shared404Page } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getTenantConfig } from "@multisite/sdk";

const BRAND = "kundler3";
const LANG = "de";

export default function NotFound() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const c = getTenantConfig(BRAND);

    if (c?.primary) {
      document.documentElement.style.setProperty("--brand", c.primary);
    }

    setConfig(c);
  }, []);

  if (!config) return null;

  return (
    <Shared404Page
      tenantConfig={config}
      lang={LANG}
      HeaderSlot={() => <Header brandSlug={BRAND} />}
      FooterSlot={() => <Footer brandSlug={BRAND} />}
    />
  );
}