import { useEffect, useState } from "react";
import { apiFetch } from "../lib/auth";

const MODULES = [
  { key: "blogs", label: "Blogs" },
  { key: "blog_categories", label: "Blog Categories" },
  { key: "blog_settings", label: "Blog Settings" },
  { key: "support_chat", label: "Support Chat" },
  { key: "brand_unique_pages", label: "Brand Unique Pages" },
  { key: "brand_inner_pages", label: "Brand Inner Pages" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <div
        className={`h-5 w-5 bg-white rounded-full transition ${
          checked ? "ml-5" : "ml-1"
        }`}
      />
    </button>
  );
}

export default function ModuleSettings() {
  const [rows, setRows] = useState([]);

  async function load() {
    const res = await apiFetch("/admin/module-permissions");
    const json = await res.json();
    setRows(json.data || []);
  }

  async function update(row, key, value) {
    const next = { ...row, [key]: value };

    setRows((prev) =>
      prev.map((r) =>
        r.brand_id === row.brand_id && r.module_key === row.module_key
          ? next
          : r
      )
    );

    await apiFetch(
      `/admin/module-permissions/${row.brand_id}/${row.module_key}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      }
    );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Module Settings</h1>

      {rows.map((row) => (
        <div
          key={row.brand_id + row.module_key}
          className="border p-4 mb-4 rounded-xl"
        >
          <h3 className="font-bold">
            {row.brand_name} — {row.module_key}
          </h3>

          <div className="flex gap-4 mt-3">
            <Toggle checked={row.can_view} onChange={(v) => update(row, "can_view", v)} />
            <Toggle checked={row.can_create} onChange={(v) => update(row, "can_create", v)} />
            <Toggle checked={row.can_edit} onChange={(v) => update(row, "can_edit", v)} />
            <Toggle checked={row.can_delete} onChange={(v) => update(row, "can_delete", v)} />
            <Toggle checked={row.show_on_website} onChange={(v) => update(row, "show_on_website", v)} />
          </div>
        </div>
      ))}
    </div>
  );
}