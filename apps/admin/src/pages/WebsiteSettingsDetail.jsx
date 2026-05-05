import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

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

function PageTable({ title, icon, rows, onToggle, savingId, t }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-white/10 dark:bg-slate-950/60">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
          <MIcon name={icon} className="text-[21px]" />
        </div>

        <div>
          <h2 className="text-lg font-black text-gray-950 dark:text-white">
            {title}
          </h2>

          <p className="text-sm text-slate-500">
            {t("websiteSettingsPagesCount", { count: rows.length })}
          </p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 text-left dark:border-white/10">
            <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {t("websiteSettingsPage")}
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {t("websiteSettingsType")}
            </th>
            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {t("websiteSettingsShowOnWebsite")}
            </th>
            <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {t("websiteSettingsStatus")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-white/10">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                {t("websiteSettingsNoPages")}
              </td>
            </tr>
          ) : (
            rows.map((page) => (
              <tr key={`${page.type}-${page.id}`} className="hover:bg-[#007ab3]/5">
                <td className="px-6 py-5">
                  <div className="text-sm font-black text-gray-950 dark:text-white">
                    {page.title || page.slug || page.id}
                  </div>

                  <div className="mt-1 text-xs font-semibold text-slate-400">
                    {page.slug || page.id}
                  </div>
                </td>

                <td className="px-6 py-5 text-sm font-bold text-slate-600">
                  {page.type}
                </td>

                <td className="px-6 py-5 text-center">
                  <Toggle
                    checked={page.is_visible !== false}
                    onChange={(value) => onToggle(page, value)}
                  />
                </td>

                <td className="px-6 py-5 text-right">
                  {savingId === page.id ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
                      {t("websiteSettingsSaving")}
                    </span>
                  ) : page.is_visible !== false ? (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700">
                      {t("websiteSettingsVisible")}
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase text-red-700">
                      {t("websiteSettingsHidden")}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function WebsiteSettingsDetail() {
  const { t } = useTranslation();
  const { brandId } = useParams();

  const [data, setData] = useState({ inner: [], shared: [], unique: [] });
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  async function load() {
    setLoading(true);

    try {
      const brandsRes = await apiFetch("/api/brands");
      const brandsJson = await brandsRes.json().catch(() => null);
      const foundBrand = brandsJson?.data?.find((b) => String(b.id) === String(brandId));
      setBrand(foundBrand || null);

      const res = await apiFetch(`/admin/website-settings/${brandId}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("websiteSettingsFailedLoadSettings"));
      }

      setData({
        inner: Array.isArray(json.inner) ? json.inner : [],
        shared: Array.isArray(json.shared) ? json.shared : [],
        unique: Array.isArray(json.unique) ? json.unique : [],
      });
    } catch (e) {
      alert(e.message || t("websiteSettingsFailedLoadSettings"));
    } finally {
      setLoading(false);
    }
  }

  async function toggle(page, value) {
    setSavingId(page.id);

    setData((prev) => {
      const updateList = (list) =>
        list.map((p) =>
          p.id === page.id && p.type === page.type
            ? { ...p, is_visible: value }
            : p
        );

      return {
        inner: updateList(prev.inner),
        shared: updateList(prev.shared),
        unique: updateList(prev.unique),
      };
    });

    try {
      const res = await apiFetch(
        `/admin/website-settings/${brandId}/${page.type}/${page.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_visible: value }),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("websiteSettingsFailedSave"));
      }
    } catch (e) {
      alert(e.message || t("websiteSettingsFailedSave"));
      load();
    } finally {
      setSavingId("");
    }
  }

  const counts = useMemo(() => {
    const all = [...data.inner, ...data.shared, ...data.unique];

    return {
      total: all.length,
      visible: all.filter((p) => p.is_visible !== false).length,
      hidden: all.filter((p) => p.is_visible === false).length,
    };
  }, [data]);

  useEffect(() => {
    load();
  }, [brandId]);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <Link to="/website-settings" className="text-sm font-bold text-[#007ab3]">
          {t("websiteSettingsBack")}
        </Link>

        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              {t("websiteSettingsDetailTitle")}
            </div>

            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              {brand?.name || t("websiteSettingsBrandWebsiteSettings")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t("websiteSettingsCounts", {
                visible: counts.visible,
                hidden: counts.hidden,
                total: counts.total,
              })}
            </p>
          </div>

          {brand?.slug ? (
            <span className="rounded-full bg-[#007ab3]/10 px-4 py-2 text-sm font-black text-[#007ab3]">
              {brand.slug}
            </span>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900">
          {t("websiteSettingsLoadingSettings")}
        </div>
      ) : (
        <>
          <PageTable
            title={t("websiteSettingsSharedInnerPages")}
            icon="description"
            rows={[...data.shared, ...data.inner]}
            onToggle={toggle}
            savingId={savingId}
            t={t}
          />

          <PageTable
            title={t("websiteSettingsUniquePages")}
            icon="web"
            rows={data.unique}
            onToggle={toggle}
            savingId={savingId}
            t={t}
          />
        </>
      )}
    </div>
  );
}