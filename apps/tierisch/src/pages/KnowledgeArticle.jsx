import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KnowledgeArticlePage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";
import { useBrandKnowledgeArticle } from "../hooks/useBrandKnowledge";

export default function KnowledgeArticle() {
  const [config, setConfig] = useState(null);
  const { slug } = useParams();

  const { article, loading, error } = useBrandKnowledgeArticle("allianz4", slug);

  useEffect(() => {
    const c = getTenantConfig("allianz4");
    if (c?.primary) document.documentElement.style.setProperty("--brand", c.primary);
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "red" }}>Knowledge article load failed</h2>
        <pre>{String(error)}</pre>
      </div>
    );
  }

  return (
    <>
      <Header brandSlug="allianz4" />
      <KnowledgeArticlePage lang="de" article={article} />
      <Footer brandSlug="allianz4" />
    </>
  );
}