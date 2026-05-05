import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

export default function AdminSettingsIndex() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/admin-settings");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load admins");
      }

      setAdmins(Array.isArray(json.admins) ? json.admins : []);
      setPermissions(Array.isArray(json.permissions) ? json.permissions : []);
    } catch (e) {
      alert(e.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }

  function countEnabled(email) {
    const e = String(email || "").toLowerCase();
    return permissions.filter((p) => p.email === e && p.can_view).length;
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
          Allianz Panel › Settings
        </div>
        <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
          Admin Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select an admin email to manage module permissions.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Admin Email
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Enabled Modules
              </th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                  Loading admins...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                  No admin users found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.email} className="hover:bg-[#007ab3]/5">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                        <MIcon name="manage_accounts" className="text-[22px]" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-gray-950 dark:text-white">
                          {admin.email}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-slate-400">
                          Created: {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-bold text-slate-600">
                    {admin.role || "admin"}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                      {countEnabled(admin.email)} enabled
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => navigate(`/admin-settings/${encodeURIComponent(admin.email)}`)}
                      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#007ab3] px-4 text-sm font-black text-white hover:brightness-110"
                    >
                      Manage
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