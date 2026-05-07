import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";

const BOOL_FIELDS = [
  "knowledge_enabled",
  "articles_enabled",
  "faqs_enabled",
  "forms_enabled",
  "show_in_header",
  "show_in_footer",
];

export default function KnowledgeSettings() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  async function loadItems() {
    setLoading(true);

    try {
      const res = await apiFetch("/admin/knowledge/settings");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeSettingsFailedLoad"));
      }

      setItems(json.data || []);
    } catch (e) {
      alert(e.message || t("knowledgeSettingsFailedLoad"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function updateSetting(row, field, value) {
    const key = `${row.brand_id}-${field}`;
    setSavingKey(key);

    const nextRow = {
      ...row,
      [field]: value,
    };

    setItems((prev) =>
      prev.map((item) => (item.brand_id === row.brand_id ? nextRow : item))
    );

    try {
      const payload = {};

      BOOL_FIELDS.forEach((name) => {
        payload[name] = Boolean(nextRow[name]);
      });

      const res = await apiFetch(`/admin/knowledge/settings/${row.brand_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeSettingsFailedSave"));
      }
    } catch (e) {
      alert(e.message || t("knowledgeSettingsFailedSave"));
      await loadItems();
    } finally {
      setSavingKey("");
    }
  }

  function Toggle({ row, field }) {
    const key = `${row.brand_id}-${field}`;

    return (
      <button
        type="button"
        disabled={savingKey === key}
        onClick={() => updateSetting(row, field, !row[field])}
        className={[
          "relative h-7 w-12 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60",
          row[field] ? "bg-[#007ab3]" : "bg-slate-300 dark:bg-slate-700",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
            row[field] ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("knowledgeArea")}
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {t("knowledgeSettings")}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("knowledgeSettingsPageSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={loadItems}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
          >
            <MIcon name="refresh" className="text-xl" />
            {t("knowledgeRefresh")}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        {loading ? (
          <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("knowledgeSettingsLoading")}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("knowledgeNoSettings")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-300">
                <tr>
                  <th className="px-5 py-4">{t("knowledgeBrand")}</th>
                  <th className="px-5 py-4">{t("knowledgeModule")}</th>
                  <th className="px-5 py-4">{t("knowledgeArticles")}</th>
                  <th className="px-5 py-4">{t("knowledgeFaqs")}</th>
                  <th className="px-5 py-4">{t("knowledgeForms")}</th>
                  <th className="px-5 py-4">{t("knowledgeShowHeader")}</th>
                  <th className="px-5 py-4">{t("knowledgeShowFooter")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {items.map((row) => (
                  <tr
                    key={row.brand_id}
                    className="hover:bg-slate-50/70 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-900 dark:text-white">
                        {row.brand_name || row.name || t("knowledgeUnnamedBrand")}
                      </div>
                      <div className="mt-1 text-xs font-bold text-slate-400">
                        {row.brand_slug || row.slug || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Toggle row={row} field="knowledge_enabled" />
                    </td>

                    <td className="px-5 py-4">
                      <Toggle row={row} field="articles_enabled" />
                    </td>

                    <td className="px-5 py-4">
                      <Toggle row={row} field="faqs_enabled" />
                    </td>

                    <td className="px-5 py-4">
                      <Toggle row={row} field="forms_enabled" />
                    </td>

                    <td className="px-5 py-4">
                      <Toggle row={row} field="show_in_header" />
                    </td>

                    <td className="px-5 py-4">
                      <Toggle row={row} field="show_in_footer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-100 p-5 text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-slate-300">
          {t("knowledgeSettingsAutoSaveNote")}
        </div>
      </div>
    </div>
  );
}