import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

export default function WebsiteSettingsIndex() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const res = await apiFetch("/api/brands");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("websiteSettingsFailedLoadBrands"));
      }

      setBrands(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      alert(e.message || t("websiteSettingsFailedLoadBrands"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
          {t("websiteSettingsBreadcrumb")}
        </div>

        <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
          {t("websiteSettingsTitle")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {t("websiteSettingsSubtitle")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {t("websiteSettingsBrand")}
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {t("websiteSettingsSlug")}
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {t("websiteSettingsStatus")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {t("websiteSettingsAction")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                  {t("websiteSettingsLoadingBrands")}
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                  {t("websiteSettingsNoBrands")}
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-[#007ab3]/5">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                        <MIcon name="language" className="text-[22px]" />
                      </div>

                      <div>
                        <div className="text-sm font-black text-gray-950 dark:text-white">
                          {brand.name}
                        </div>

                        <div className="mt-1 text-xs font-semibold text-slate-400">
                          {brand.route || "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-bold text-slate-600">
                    {brand.slug}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                      {brand.status || t("websiteSettingsActive")}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => navigate(`/website-settings/${brand.id}`)}
                      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#007ab3] px-4 text-sm font-black text-white hover:brightness-110"
                    >
                      {t("websiteSettingsManage")}
                      <MIcon name="arrow_forward" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}