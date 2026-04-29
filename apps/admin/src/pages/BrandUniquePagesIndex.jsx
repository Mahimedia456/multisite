import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../lib/api";
import MIcon from "../components/MIcon";

export default function BrandUniquePagesIndex() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadBrands() {
    setLoading(true);

    try {
      const res = await apiGet("/api/brands");
      setBrands(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      alert(e?.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();

    return brands.filter((brand) => {
      const brandStatus = String(brand.status || "").toLowerCase();

      if (status !== "all" && brandStatus !== status) return false;

      if (!q) return true;

      return (
        String(brand.name || "").toLowerCase().includes(q) ||
        String(brand.slug || "").toLowerCase().includes(q) ||
        String(brand.route || "").toLowerCase().includes(q) ||
        brandStatus.includes(q)
      );
    });
  }, [brands, query, status]);

  const activeCount = brands.filter(
    (b) => String(b.status || "").toLowerCase() === "active"
  ).length;

  const inactiveCount = Math.max(0, brands.length - activeCount);

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading brands...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-950">Brand Portfolio</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Managing {activeCount} active and {inactiveCount} inactive sub-brands.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-[330px] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4">
            <MIcon name="search" className="text-[20px] text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, route or status..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>

          <div className="flex rounded-xl border border-zinc-200 bg-white p-1">
            {["all", "active", "inactive"].map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setStatus(x)}
                className={[
                  "h-8 rounded-lg px-4 text-xs font-bold capitalize",
                  status === x
                    ? "bg-zinc-100 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-700",
                ].join(" ")}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-violet-600">
              <MIcon name="groups" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Total Brands
              </p>
              <h2 className="text-2xl font-black text-zinc-950">{brands.length}</h2>
              <p className="text-xs font-black text-zinc-500">
                {activeCount} ACTIVE • {inactiveCount} INACTIVE
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-blue-500">
              <MIcon name="check_circle" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Active Rate
              </p>
              <h2 className="text-2xl font-black text-zinc-950">
                {brands.length ? Math.round((activeCount / brands.length) * 100) : 0}.0%
              </h2>
              <p className="text-xs font-black text-blue-600">PORTFOLIO HEALTH</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-amber-50 text-amber-500">
              <MIcon name="history" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Sync Status
              </p>
              <h2 className="text-2xl font-black text-zinc-950">Up to date</h2>
              <p className="text-xs font-black text-amber-600">LAST FETCH OK</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-white text-left">
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Brand Name
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Route
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Status
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Templates
              </th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                Last Updated
              </th>
              <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-widest text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBrands.map((brand) => {
              const isActive = String(brand.status || "").toLowerCase() === "active";

              return (
                <tr key={brand.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100 text-zinc-500">
                        <MIcon name="business" className="text-[20px]" />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/brand-unique-pages/${brand.id}`)}
                          className="text-left text-sm font-black text-zinc-950 hover:text-violet-600"
                        >
                          {brand.name}
                        </button>
                        <p className="mt-1 text-xs text-zinc-400">{brand.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-zinc-600">
                    {brand.route || `/${brand.slug}`}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-zinc-100 text-zinc-500",
                      ].join(" ")}
                    >
                      • {brand.status || "active"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-zinc-700">
                    {brand.templatesCount || 0}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-500">
                    {brand.updated_at || brand.updatedAt
                      ? new Date(brand.updated_at || brand.updatedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-3 text-zinc-400">
                      <button
                        type="button"
                        onClick={() => navigate(`/brand-unique-pages/${brand.id}`)}
                        className="hover:text-violet-600"
                        title="Manage unique pages"
                      >
                        <MIcon name="settings" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/brand-unique-pages/${brand.id}`)}
                        className="hover:text-violet-600"
                        title="Open pages"
                      >
                        <MIcon name="edit" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/brand-unique-pages/${brand.id}`)}
                        className="hover:text-violet-600"
                        title="Duplicate"
                      >
                        <MIcon name="content_copy" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!filteredBrands.length && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-5 text-sm text-zinc-500">
          <span>
            Showing {filteredBrands.length ? 1 : 0}-{filteredBrands.length} of{" "}
            {brands.length} brands
          </span>

          <div className="flex items-center gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-lg text-zinc-300">
              <MIcon name="chevron_left" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-sm font-black text-white">
              1
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-zinc-500">
              2
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-zinc-500">
              3
            </button>
            <span className="px-2">...</span>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-zinc-500">
              6
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400">
              <MIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}