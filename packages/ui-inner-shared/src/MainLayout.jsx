import { useEffect, useState } from "react";
import { getTenantConfig } from "@multisite/sdk";

import Header from "./sections/Header";
import SubNav from "./sections/SubNav";
import SplitHero from "./sections/SplitHero";
import BrandCards from "./sections/BrandCards";
import TrustStats from "./sections/TrustStats";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";

export default function MainLayout({ tenant = "main" }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getTenantConfig(tenant).then(setConfig);
  }, [tenant]);

  if (!config) return null;

  return (
    <div
      className="min-h-screen font-display bg-background-light text-[#140c1d]"
      style={{ "--brand": config.primary }}
    >
      <Header config={config} />
      <SubNav />
      <main>
        <SplitHero />
        <BrandCards />
        <TrustStats />
        <Experience />
      </main>
      <Footer config={config} />
    </div>
  );
}
