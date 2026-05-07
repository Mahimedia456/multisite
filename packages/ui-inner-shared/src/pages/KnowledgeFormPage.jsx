import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KnowledgeFormPage } from "@multisite/ui-inner-shared";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTenantConfig } from "@multisite/sdk";
import { useBrandKnowledgeForm, submitBrandKnowledgeForm } from "../hooks/useBrandKnowledge";

export default function KnowledgeForm() {
  const [config, setConfig] = useState(null);
  const { slug } = useParams();

  const { form, loading, error } = useBrandKnowledgeForm("allianz4", slug);

  useEffect(() => {
    const c = getTenantConfig("allianz4");
    if (c?.primary) document.documentElement.style.setProperty("--brand", c.primary);
    setConfig(c);
  }, []);

  if (!config || loading) return null;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "red" }}>Knowledge form load failed</h2>
        <pre>{String(error)}</pre>
      </div>
    );
  }

  return (
    <>
      <Header brandSlug="allianz4" />
      <KnowledgeFormPage
        lang="de"
        form={form}
        onSubmit={(payload) =>
          submitBrandKnowledgeForm({
            brandSlug: "allianz4",
            formSlug: slug,
            payload,
          })
        }
      />
      <Footer brandSlug="allianz4" />
    </>
  );
}