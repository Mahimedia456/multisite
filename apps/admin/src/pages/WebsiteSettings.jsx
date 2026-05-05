import { useEffect, useState } from "react";
import { apiFetch } from "../lib/auth";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <div className={`h-5 w-5 bg-white rounded-full ${checked ? "ml-5" : "ml-1"}`} />
    </button>
  );
}

export default function WebsiteSettings() {
  const [brandId, setBrandId] = useState("");
  const [data, setData] = useState({ inner: [], unique: [] });

  async function load() {
    if (!brandId) return;

    const res = await apiFetch(`/admin/website-settings/${brandId}`);
    const json = await res.json();
    setData(json);
  }

  async function update(type, pageId, value) {
    await apiFetch(`/admin/website-settings/${brandId}/${type}/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: value }),
    });

    load();
  }

  useEffect(() => {
    load();
  }, [brandId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Website Settings</h1>

      {/* Brand select */}
      <input
        placeholder="Enter Brand ID"
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        className="border p-2 mb-4"
      />

      {/* Inner Pages */}
      <h2 className="font-bold mt-4">Inner Pages</h2>
      {data.inner.map((p) => (
        <div key={p.id} className="flex justify-between p-2 border">
          {p.title}
          <Toggle
            checked={p.is_visible}
            onChange={(v) => update("inner", p.id, v)}
          />
        </div>
      ))}

      {/* Unique Pages */}
      <h2 className="font-bold mt-6">Unique Pages</h2>
      {data.unique.map((p) => (
        <div key={p.id} className="flex justify-between p-2 border">
          {p.title}
          <Toggle
            checked={p.is_visible}
            onChange={(v) => update("unique", p.id, v)}
          />
        </div>
      ))}
    </div>
  );
}