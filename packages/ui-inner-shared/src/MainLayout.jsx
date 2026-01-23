// apps/aamir/src/TeamLayout.jsx (or layouts/TeamLayout.jsx)
import { useEffect, useMemo, useState } from "react";
import { getTenantConfig } from "@multisite/sdk";
import { useSharedPage } from "./hooks/useSharedPage";

import Header from "./sections/Header";
import SubNav from "./sections/SubNav";
import Footer from "./sections/Footer";

// ✅ TEAM sections
import TeamHero from "./sections/team/Hero";
import TeamIntro from "./sections/team/Intro";
import TeamGrid from "./sections/team/TeamGrid";
import TeamGallery from "./sections/team/Gallery";
import TeamBenefits from "./sections/team/Benefits";
import TeamCareerCTA from "./sections/team/CareerCTA";

const TEAM_SECTION_MAP = {
  Hero: TeamHero,
  Intro: TeamIntro,
  TeamGrid,
  Gallery: TeamGallery,
  Benefits: TeamBenefits,
  CareerCTA: TeamCareerCTA,
};

export default function TeamLayout({ tenant = "main" }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getTenantConfig(tenant).then(setConfig);
  }, [tenant]);

  // ✅ slug "team"
  const { content, loading } = useSharedPage("team");
  const sections = useMemo(
    () => (Array.isArray(content?.sections) ? content.sections : []),
    [content]
  );

  if (!config) return null;
  if (loading) return null;

  return (
    <div
      className="min-h-screen font-display bg-background-light text-[#140c1d]"
      style={{ "--brand": config.primary }}
    >
      <Header config={config} />
      <SubNav />

      <main className="max-w-7xl mx-auto px-6 space-y-24 py-16">
        {sections.map((s, i) => {
          const Comp = TEAM_SECTION_MAP[s?.type];
          if (!Comp) return null;
          return <Comp key={i} {...(s?.props || {})} tenantConfig={config} />;
        })}
      </main>

      <Footer config={config} />
    </div>
  );
}
