import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../components/MIcon";

const SETTINGS_ITEMS = [
  {
    titleKey: "settingsAdminSettingsTitle",
    descriptionKey: "settingsAdminSettingsDesc",
    icon: "manage_accounts",
    path: "/admin-settings",
  },
  {
    titleKey: "settingsModuleSettingsTitle",
    descriptionKey: "settingsModuleSettingsDesc",
    icon: "settings",
    path: "/settings/modules",
  },
  {
    titleKey: "settingsWebsiteSettingsTitle",
    descriptionKey: "settingsWebsiteSettingsDesc",
    icon: "language",
    path: "/website-settings",
  },
  {
    titleKey: "settingsBlogSettingsTitle",
    descriptionKey: "settingsBlogSettingsDesc",
    icon: "admin_panel_settings",
    path: "/blog-settings",
  },

  // ✅ HIDDEN FOR ALL ADMIN ACCOUNTS
  // Code kept, but hidden from Settings UI.
  // {
  //   titleKey: "knowledgeSettings",
  //   descriptionKey: "knowledgeSettingsDesc",
  //   icon: "school",
  //   path: "/settings/knowledge",
  // },
];

export default function SettingsIndex() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
          {t("settingsBreadcrumb")}
        </div>

        <h1 className="mt-2 text-2xl font-black text-gray-950 dark:text-white">
          {t("settingsTitle")}
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
          {t("settingsSubtitle")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("settingsColumnSetting")}
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("settingsColumnDescription")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("settingsColumnAction")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {SETTINGS_ITEMS.map((item) => (
                <tr key={item.path} className="hover:bg-[#007ab3]/5">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                        <MIcon name={item.icon} className="text-[24px]" />
                      </div>

                      <div>
                        <div className="text-sm font-black text-gray-950 dark:text-white">
                          {t(item.titleKey)}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-slate-400">
                          {item.path}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
                    {t(item.descriptionKey)}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
                    >
                      {t("settingsOpen")}
                      <MIcon name="arrow_forward" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}