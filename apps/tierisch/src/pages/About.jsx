import { useEffect, useState } from "react";
import { AboutPage } from "@multisite/ui-inner-shared";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "../hooks/useSharedPage";

const BRAND = "allianz4";

function hexToRgbTriplet(hex) {
  const h = String(hex || "").replace("#", "").trim();
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return `${r} ${g} ${b}`;
}

export default function About() {
  const [config, setConfig] = useState(null);
  const { content, loading, error } = useSharedPage("about");

  useEffect(() => {
    const c = getTenantConfig(BRAND);

    // ✅ brand selector for your CSS overrides
    document.body.dataset.brand = BRAND;

    // ✅ set shared header variables (if primary is hex)
    const rgb = hexToRgbTriplet(c?.primary);
    if (rgb) {
      document.documentElement.style.setProperty("--primary", rgb);
      document.documentElement.style.setProperty("--primary-dark", rgb); // ya darker value if you have
    }

    setConfig(c);
    return () => {
      delete document.body.dataset.brand;
    };
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
      HeaderSlot={() => <Header brandSlug={BRAND} />}
      FooterSlot={() => <Footer brandSlug={BRAND} />}
      content={content}
    />
  );
}
