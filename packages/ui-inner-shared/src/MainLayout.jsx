import { useEffect, useMemo, useState } from "react";
import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "./hooks/useSharedPage";

// home sections (make them accept props from DB)
import Header from "./sections/Header";
import SubNav from "./sections/SubNav";
import SplitHero from "./sections/SplitHero";
import BrandCards from "./sections/BrandCards";
import TrustStats from "./sections/TrustStats";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";

const HOME_SECTION_MAP = {
  SplitHero,
  BrandCards,
  TrustStats,
  Experience,
};

export default function MainLayout({ tenant = "main" }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getTenantConfig(tenant).then(setConfig);
  }, [tenant]);

  // ✅ slug "home" (DB me create karo)
  const { content, loading } = useSharedPage("home");
  const sections = useMemo(() => (Array.isArray(content?.sections) ? content.sections : []), [content]);

  if (!config) return null;
  if (loading) return null;

  return (
    <div
      className="min-h-screen font-display bg-background-light text-[#140c1d]"
      style={{ "--brand": config.primary }}
    >
      <Header config={config} />
      <SubNav />

      <main>
        {sections.map((s, i) => {
          const Comp = HOME_SECTION_MAP[s?.type];
          if (!Comp) return null;
          return <Comp key={i} {...(s?.props || {})} tenantConfig={config} />;
        })}
      </main>

      <Footer config={config} />
    </div>
  );
}
