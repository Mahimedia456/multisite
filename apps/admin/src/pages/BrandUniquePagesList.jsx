import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/auth";

export default function BrandUniquePagesList() {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPages() {
    setLoading(true);
    try {
      const res = await apiFetch(`/admin/brand-unique-pages/brands/${brandId}/pages`);
      const text = await res.text();
let json;

try {
  json = text ? JSON.parse(text) : null;
} catch {
  throw new Error(`API returned non-JSON response: ${text.slice(0, 80)}`);
}

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load pages");
      }

      setBrand(json.data.brand);
      setPages(json.data.pages || []);
    } catch (e) {
      alert(e.message || "Failed to load pages");
    } finally {
      setLoading(false);
    }
  }

  async function createPage(slug, title) {
    try {
      const res = await apiFetch(`/admin/brand-unique-pages/brands/${brandId}/pages`, {
        method: "POST",
        body: {
          slug,
          title,
          status: "PUBLISHED",
          content: {
            templateKey: "dropbrand-home-builder",
            sections: [],
          },
        },
      });

      const text = await res.text();
let json;

try {
  json = text ? JSON.parse(text) : null;
} catch {
  throw new Error(`API returned non-JSON response: ${text.slice(0, 80)}`);
}

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to create page");
      }

      await loadPages();
    } catch (e) {
      alert(e.message || "Failed to create page");
    }
  }

  useEffect(() => {
    loadPages();
  }, [brandId]);

  if (loading) return <div className="p-6">Loading pages...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <button
          onClick={() => navigate("/brand-unique-pages")}
          className="text-sm font-bold text-violet-600"
        >
          ← Back to brands
        </button>

        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
          {brand?.name || "Brand"} Unique Pages
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage brand-specific pages like Home, About and Contact.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => createPage("home", "Home Page")}
          className="h-10 px-4 rounded-xl bg-violet-600 text-white text-sm font-bold"
        >
          + Home
        </button>

        <button
          onClick={() => createPage("about", "About Page")}
          className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-bold"
        >
          + About
        </button>

        <button
          onClick={() => createPage("contact", "Contact Page")}
          className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-bold"
        >
          + Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6"
          >
            <div className="text-xs font-bold text-gray-400 uppercase">
              {page.slug}
            </div>

            <h2 className="mt-2 text-xl font-extrabold text-gray-900">
              {page.title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Status: {page.status}
            </p>

            <button
              onClick={() =>
                navigate(`/brand-unique-pages/${brandId}/pages/${page.id}/builder`)
              }
              className="mt-5 h-10 w-full rounded-xl bg-violet-600 text-white text-sm font-bold"
            >
              Open Visual Builder
            </button>
          </div>
        ))}
      </div>

      {!pages.length && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No unique pages yet. Create Home page first.
        </div>
      )}
    </div>
  );
}