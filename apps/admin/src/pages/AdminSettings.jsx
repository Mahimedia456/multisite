import { useEffect, useState } from "react";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

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

const MODULES = [
  { key: "overview", label: "Overview", adminOnly: false },
  { key: "brands", label: "Brands", adminOnly: false },
  { key: "main_website", label: "Main Website", adminOnly: true },
  { key: "generate_brand", label: "Generate Brand", adminOnly: true },
  { key: "support_chat", label: "Support Chat", adminOnly: false },
  { key: "blogs", label: "Blogs", adminOnly: false },
  { key: "blog_categories", label: "Blog Categories", adminOnly: false },
  { key: "blog_settings", label: "Blog Settings", adminOnly: true },
  { key: "module_settings", label: "Module Settings", adminOnly: true },
  { key: "admin_settings", label: "Admin Settings", adminOnly: true },
  { key: "brand_unique_pages", label: "Brand Unique Pages", adminOnly: true },
  { key: "brand_inner_pages", label: "Brand Inner Pages", adminOnly: true },
];

export default function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/admin-settings");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load admin settings");
      }

      setAdmins(Array.isArray(json.admins) ? json.admins : []);
      setSettings(Array.isArray(json.permissions) ? json.permissions : []);
    } catch (e) {
      alert(e.message || "Failed to load admin settings");
      setAdmins([]);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }

  function getRow(admin, moduleKey) {
    return (
      settings.find(
        (p) =>
          String(p.admin_id) === String(admin.id) &&
          String(p.module_key) === String(moduleKey)
      ) || {
        admin_id: admin.id,
        email: admin.email,
        module_key: moduleKey,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
      }
    );
  }

  async function save(admin, moduleKey, patch) {
    const row = getRow(admin, moduleKey);
    const next = { ...row, ...patch };

    if (patch.can_view === false) {
      next.can_create = false;
      next.can_edit = false;
      next.can_delete = false;
    }

    if (
      patch.can_create === true ||
      patch.can_edit === true ||
      patch.can_delete === true
    ) {
      next.can_view = true;
    }

    setSettings((prev) => {
      const exists = prev.some(
        (p) =>
          String(p.admin_id) === String(admin.id) &&
          String(p.module_key) === String(moduleKey)
      );

      if (!exists) return [...prev, next];

      return prev.map((p) =>
        String(p.admin_id) === String(admin.id) &&
        String(p.module_key) === String(moduleKey)
          ? next
          : p
      );
    });

    const key = `${admin.id}:${moduleKey}`;
    setSavingKey(key);

    try {
      const res = await apiFetch(
        `/admin/admin-settings/${admin.id}/${moduleKey}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to save admin setting");
      }
    } catch (e) {
      alert(e.message || "Failed to save admin setting");
      load();
    } finally {
      setSavingKey("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              Allianz Panel › Role Permissions
            </div>

            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              Admin Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Control which admin user can access each module.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white"
          >
            <MIcon name="refresh" className="text-[20px]" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900">
          Loading admin settings...
        </div>
      ) : (
        <div className="space-y-6">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-white/10 dark:bg-slate-950/60">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                    <MIcon name="admin_panel_settings" className="text-[22px]" />
                  </div>

                  <div>
                    <div className="text-sm font-black text-gray-950 dark:text-white">
                      {admin.email}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-400">
                      Role: {admin.role || "admin"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-left dark:border-white/10">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Module
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        View
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Create
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Edit
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Delete
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                    {MODULES.map((module) => {
                      const row = getRow(admin, module.key);
                      const key = `${admin.id}:${module.key}`;

                      return (
                        <tr key={module.key} className="hover:bg-[#007ab3]/5">
                          <td className="px-6 py-5">
                            <div className="text-sm font-black text-gray-950 dark:text-white">
                              {module.label}
                            </div>
                            <div className="mt-1 text-xs font-semibold text-slate-400">
                              {module.key}
                            </div>
                          </td>

                          {["can_view", "can_create", "can_edit", "can_delete"].map(
                            (permissionKey) => (
                              <td
                                key={permissionKey}
                                className="px-6 py-5 text-center"
                              >
                                <Toggle
                                  checked={Boolean(row[permissionKey])}
                                  onChange={(value) =>
                                    save(admin, module.key, {
                                      [permissionKey]: value,
                                    })
                                  }
                                />
                              </td>
                            )
                          )}

                          <td className="px-6 py-5 text-right">
                            {savingKey === key ? (
                              <span className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
                                Saving...
                              </span>
                            ) : row.can_view ? (
                              <span className="inline-flex rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700">
                                Enabled
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500">
                                Disabled
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}