import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
];

export default function SettingsIndex() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
          {t("settingsBreadcrumb")}
        </div>

        <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
          {t("settingsTitle")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {t("settingsSubtitle")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <table className="w-full">
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
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                      <MIcon name={item.icon} className="text-[22px]" />
                    </div>

                    <div className="text-sm font-black text-gray-950 dark:text-white">
                      {t(item.titleKey)}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                  {t(item.descriptionKey)}
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => navigate(item.path)}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#007ab3] px-4 text-sm font-black text-white hover:brightness-110"
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
  );
}