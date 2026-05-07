import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../lib/auth";

const MODULES = [
  { key: "overview", labelKey: "overview" },
  { key: "brands", labelKey: "brands" },
  { key: "main_website", labelKey: "adminModuleMainWebsite" },
  { key: "generate_brand", labelKey: "adminModuleGenerateBrand" },
  { key: "support_chat", labelKey: "supportChat" },
  { key: "blogs", labelKey: "blogs" },
  { key: "blog_categories", labelKey: "blogCategories" },

  { key: "knowledge_area", labelKey: "knowledgeArea" },
  { key: "knowledge_categories", labelKey: "knowledgeCategories" },
  { key: "knowledge_articles", labelKey: "knowledgeArticles" },
  { key: "knowledge_faqs", labelKey: "knowledgeFaqs" },
  { key: "knowledge_forms", labelKey: "knowledgeForms" },
  { key: "knowledge_submissions", labelKey: "knowledgeSubmissions" },

  { key: "settings", labelKey: "settings" },

  { key: "blog_settings", labelKey: "adminModuleBlogSettings" },
  { key: "module_settings", labelKey: "adminModuleModuleSettings" },
  { key: "admin_settings", labelKey: "adminSettingsTitle" },
  { key: "website_settings", labelKey: "adminModuleWebsiteSettings" },
  { key: "knowledge_settings", labelKey: "knowledgeSettings" },

  { key: "brand_unique_pages", labelKey: "brandUniquePages" },
  { key: "brand_inner_pages", labelKey: "brandInnerPages" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "relative h-7 w-12 rounded-full transition",
        checked ? "bg-[#007ab3]" : "bg-slate-300 dark:bg-slate-700",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
          checked ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}

export default function AdminSettingsDetail() {
  const { t } = useTranslation();
  const { email: encodedEmail } = useParams();
  const email = decodeURIComponent(encodedEmail || "").toLowerCase();

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/admin-settings");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("adminSettingsFailedPermissions"));
      }

      const rows = Array.isArray(json.permissions) ? json.permissions : [];
      setPermissions(rows.filter((p) => String(p.email).toLowerCase() === email));
    } catch (e) {
      alert(e.message || t("adminSettingsFailedPermissions"));
    } finally {
      setLoading(false);
    }
  }

  function getRow(moduleKey) {
    return (
      permissions.find((p) => p.module_key === moduleKey) || {
        email,
        module_key: moduleKey,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
      }
    );
  }

  async function save(moduleKey, patch) {
    const row = getRow(moduleKey);
    const next = { ...row, ...patch };

    if (patch.can_view === false) {
      next.can_create = false;
      next.can_edit = false;
      next.can_delete = false;
    }

    if (patch.can_create || patch.can_edit || patch.can_delete) {
      next.can_view = true;
    }

    setPermissions((prev) => {
      const exists = prev.some((p) => p.module_key === moduleKey);
      if (!exists) return [...prev, next];
      return prev.map((p) => (p.module_key === moduleKey ? next : p));
    });

    setSavingKey(moduleKey);

    try {
      const res = await apiFetch(
        `/admin/admin-settings/${encodeURIComponent(email)}/${moduleKey}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("adminSettingsFailedSaveGeneric"));
      }
    } catch (e) {
      alert(e.message || t("adminSettingsFailedSaveGeneric"));
      load();
    } finally {
      setSavingKey("");
    }
  }

  const enabledCount = useMemo(
    () => MODULES.filter((m) => getRow(m.key).can_view).length,
    [permissions]
  );

  useEffect(() => {
    load();
  }, [email]);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <Link to="/admin-settings" className="text-sm font-bold text-[#007ab3]">
          {t("adminSettingsBack")}
        </Link>

        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              {t("adminSettingsDetailTitle")}
            </div>

            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              {email}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t("adminSettingsModulesEnabled", { count: enabledCount })}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("adminSettingsModule")}
                </th>
                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("adminSettingsView")}
                </th>
                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("adminSettingsCreate")}
                </th>
                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("adminSettingsEdit")}
                </th>
                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("adminSettingsDelete")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("adminSettingsStatus")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    {t("adminSettingsLoadingPermissions")}
                  </td>
                </tr>
              ) : (
                MODULES.map((module) => {
                  const row = getRow(module.key);

                  return (
                    <tr key={module.key} className="hover:bg-[#007ab3]/5">
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-gray-950 dark:text-white">
                          {t(module.labelKey)}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-slate-400">
                          {module.key}
                        </div>
                      </td>

                      {["can_view", "can_create", "can_edit", "can_delete"].map((key) => (
                        <td key={key} className="px-6 py-5 text-center">
                          <Toggle
                            checked={Boolean(row[key])}
                            onChange={(value) => save(module.key, { [key]: value })}
                          />
                        </td>
                      ))}

                      <td className="px-6 py-5 text-right">
                        {savingKey === module.key ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
                            {t("adminSettingsSaving")}
                          </span>
                        ) : row.can_view ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700">
                            {t("adminSettingsEnabled")}
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500">
                            {t("adminSettingsDisabled")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}