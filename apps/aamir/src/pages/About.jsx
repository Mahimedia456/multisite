import { AboutPage } from "@multisite/ui-inner-shared";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getTenantConfig } from "@multisite/sdk";

export default function About() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getTenantConfig("aamir").then((c) => {
      document.documentElement.style.setProperty("--brand", c.primary);
      setConfig(c);
    });
  }, []);

  if (!config) return null;

  return <AboutPage tenantConfig={config} HeaderSlot={Header} />;
}
