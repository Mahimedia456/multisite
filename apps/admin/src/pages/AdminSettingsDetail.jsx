import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

const MODULES = [
  { key: "overview", label: "Overview" },
  { key: "brands", label: "Brands" },
  { key: "main_website", label: "Main Website" },
  { key: "generate_brand", label: "Generate Brand" },
  { key: "support_chat", label: "Support Chat" },
  { key: "blogs", label: "Blogs" },
  { key: "blog_categories", label: "Blog Categories" },
  { key: "blog_settings", label: "Blog Settings" },
  { key: "module_settings", label: "Module Settings" },
  { key: "admin_settings", label: "Admin Settings" },
  { key: "website_settings", label: "Website Settings" },
  { key: "brand_unique_pages", label: "Brand Unique Pages" },
  { key: "brand_inner_pages", label: "Brand Inner Pages" },
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
        throw new Error(json?.message || "Failed to load permissions");
      }

      const rows = Array.isArray(json.permissions) ? json.permissions : [];
      setPermissions(rows.filter((p) => String(p.email).toLowerCase() === email));
    } catch (e) {
      alert(e.message || "Failed to load permissions");
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
        throw new Error(json?.message || "Failed to save");
      }
    } catch (e) {
      alert(e.message || "Failed to save");
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
          ← Back to Admin Settings
        </Link>

        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              Admin Permission Detail
            </div>
            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              {email}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {enabledCount} modules enabled for this admin.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Module</th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">View</th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">Create</th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">Edit</th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">Delete</th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                  Loading permissions...
                </td>
              </tr>
            ) : (
              MODULES.map((module) => {
                const row = getRow(module.key);

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
                          Saving...
                        </span>
                      ) : row.can_view ? (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700">
                          Enabled
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500">
                          Disabled
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
  );
}