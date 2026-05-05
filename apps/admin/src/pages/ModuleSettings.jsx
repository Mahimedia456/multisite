import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

const MODULES = [
  { key: "overview", labelKey: "overview" },
  { key: "brands", labelKey: "brands" },
  { key: "support_chat", labelKey: "supportChat" },
  { key: "blogs", labelKey: "blogs" },
  { key: "blog_categories", labelKey: "blogCategories" },
  { key: "blog_settings", labelKey: "adminModuleBlogSettings" },
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
        checked ? "bg-[#007ab3]" : "bg-slate-300",
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

export default function ModuleSettings() {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/module-permissions");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("moduleSettingsFailedLoad"));
      }

      setRows(Array.isArray(json.data) ? json.data : []);
      const firstBrand = json.data?.find((r) => r.brand_id)?.brand_id || "";
      setSelectedBrandId((prev) => prev || firstBrand);
    } catch (e) {
      alert(e.message || t("moduleSettingsFailedLoad"));
    } finally {
      setLoading(false);
    }
  }

  const brands = useMemo(() => {
    const map = new Map();

    rows.forEach((r) => {
      if (r.brand_id) {
        map.set(r.brand_id, {
          id: r.brand_id,
          name: r.brand_name || r.brand_slug || t("moduleSettingsUnnamedBrand"),
          slug: r.brand_slug,
        });
      }
    });

    return Array.from(map.values());
  }, [rows, t]);

  function getRow(moduleKey) {
    return (
      rows.find(
        (r) => r.brand_id === selectedBrandId && r.module_key === moduleKey
      ) || {
        brand_id: selectedBrandId,
        module_key: moduleKey,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
        show_on_website: true,
      }
    );
  }

  async function save(moduleKey, patch) {
    const current = getRow(moduleKey);
    const next = { ...current, ...patch };

    if (patch.can_view === false) {
      next.can_create = false;
      next.can_edit = false;
      next.can_delete = false;
    }

    if (patch.can_create || patch.can_edit || patch.can_delete) {
      next.can_view = true;
    }

    setRows((prev) => {
      const exists = prev.some(
        (r) => r.brand_id === selectedBrandId && r.module_key === moduleKey
      );

      if (!exists) return [...prev, next];

      return prev.map((r) =>
        r.brand_id === selectedBrandId && r.module_key === moduleKey ? next : r
      );
    });

    setSavingKey(moduleKey);

    try {
      const res = await apiFetch(
        `/admin/module-permissions/${selectedBrandId}/${moduleKey}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("moduleSettingsFailedSave"));
      }
    } catch (e) {
      alert(e.message || t("moduleSettingsFailedSave"));
      load();
    } finally {
      setSavingKey("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
          {t("moduleSettingsBreadcrumb")}
        </div>

        <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
          {t("moduleSettingsTitle")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {t("moduleSettingsSubtitle")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="mb-4 px-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {t("moduleSettingsBrands")}
          </div>

          {loading ? (
            <div className="p-4 text-sm text-slate-500">
              {t("moduleSettingsLoadingBrands")}
            </div>
          ) : brands.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">
              {t("moduleSettingsNoBrands")}
            </div>
          ) : (
            <div className="space-y-2">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrandId(brand.id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                    selectedBrandId === brand.id
                      ? "bg-[#007ab3] text-white"
                      : "text-slate-700 hover:bg-[#007ab3]/10",
                  ].join(" ")}
                >
                  <MIcon name="business" className="text-[20px]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">
                      {brand.name}
                    </span>
                    <span className="block truncate text-xs opacity-70">
                      {brand.slug}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-white/10 dark:bg-slate-950/60">
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {selectedBrand?.name || t("moduleSettingsSelectBrand")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("moduleSettingsAccessNote")}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-white/10">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsModule")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsView")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsCreate")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsEdit")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsDelete")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsWebsite")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {t("moduleSettingsStatus")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {!selectedBrandId ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                      {t("moduleSettingsSelectBrandEmpty")}
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

                        {[
                          "can_view",
                          "can_create",
                          "can_edit",
                          "can_delete",
                          "show_on_website",
                        ].map((key) => (
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
                              {t("moduleSettingsSaving")}
                            </span>
                          ) : row.can_view ? (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700">
                              {t("moduleSettingsEnabled")}
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500">
                              {t("moduleSettingsDisabled")}
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
    </div>
  );
}