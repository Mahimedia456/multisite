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

export default function BlogSettings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  async function loadRows() {
    setLoading(true);

    try {
      const res = await apiFetch("/admin/blog-module-permissions");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load blog settings");
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      alert(e.message || "Failed to load blog settings");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function updateLocal(brandId, key, value) {
    setRows((prev) =>
      prev.map((row) =>
        row.brand_id === brandId ? { ...row, [key]: value } : row
      )
    );
  }

  async function saveRow(row) {
    setSavingId(row.brand_id);

    try {
      const res = await apiFetch(
        `/admin/blog-module-permissions/${row.brand_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            can_view: row.can_view,
            can_create: row.can_create,
            can_edit: row.can_edit,
            can_delete: row.can_delete,
          }),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to save settings");
      }
    } catch (e) {
      alert(e.message || "Failed to save settings");
      loadRows();
    } finally {
      setSavingId("");
    }
  }

  async function toggleAndSave(row, key, value) {
    const next = { ...row, [key]: value };

    if (key === "can_view" && value === false) {
      next.can_create = false;
      next.can_edit = false;
      next.can_delete = false;
    }

    if (["can_create", "can_edit", "can_delete"].includes(key) && value === true) {
      next.can_view = true;
    }

    setRows((prev) =>
      prev.map((item) => (item.brand_id === row.brand_id ? next : item))
    );

    await saveRow(next);
  }

  useEffect(() => {
    loadRows();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              Allianz Panel › Module Permissions
            </div>

            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              Blog Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Control which brand can view, create, edit, or delete blog posts.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRows}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white"
          >
            <MIcon name="refresh" className="text-[20px]" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Brand
                </th>

                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  View Module
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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-sm text-slate-500"
                  >
                    Loading settings...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-sm text-slate-500"
                  >
                    No brands found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.brand_id}
                    className="transition-colors hover:bg-[#007ab3]/5"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                          <MIcon name="business" className="text-[21px]" />
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-gray-950 dark:text-white">
                            {row.brand_name}
                          </div>

                          <div className="mt-1 truncate text-xs font-semibold text-slate-400">
                            {row.brand_slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <Toggle
                        checked={Boolean(row.can_view)}
                        onChange={(value) =>
                          toggleAndSave(row, "can_view", value)
                        }
                      />
                    </td>

                    <td className="px-6 py-5 text-center">
                      <Toggle
                        checked={Boolean(row.can_create)}
                        onChange={(value) =>
                          toggleAndSave(row, "can_create", value)
                        }
                      />
                    </td>

                    <td className="px-6 py-5 text-center">
                      <Toggle
                        checked={Boolean(row.can_edit)}
                        onChange={(value) =>
                          toggleAndSave(row, "can_edit", value)
                        }
                      />
                    </td>

                    <td className="px-6 py-5 text-center">
                      <Toggle
                        checked={Boolean(row.can_delete)}
                        onChange={(value) =>
                          toggleAndSave(row, "can_delete", value)
                        }
                      />
                    </td>

                    <td className="px-6 py-5 text-right">
                      {savingId === row.brand_id ? (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-400">
          Blog module permissions are saved automatically.
        </div>
      </div>
    </div>
  );
}