import { useEffect, useState } from "react";
import { AboutPage } from "@multisite/ui-inner-shared";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";

export default function About() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const maybe = getTenantConfig("aamir");

        // ✅ if promise
        const res = typeof maybe?.then === "function" ? await maybe : maybe;

        const cfg = res?.data ?? res;
        if (!cfg) throw new Error("Tenant config is empty");

        if (cfg?.primary) {
          document.documentElement.style.setProperty("--brand", cfg.primary);
        }

        if (mounted) setConfig(cfg);
      } catch (e) {
        console.error("getTenantConfig failed:", e);
        if (mounted) setConfig(null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!config) return null;

  return (
    <AboutPage
      tenantConfig={config}
      HeaderSlot={() => <Header />}
      FooterSlot={() => <Footer />}
    />
  );
}
