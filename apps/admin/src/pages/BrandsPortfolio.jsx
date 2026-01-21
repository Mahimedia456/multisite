import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function StatusPill({ status }) {
  const active = status === "active";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
        active
          ? "bg-green-50 text-green-600 border-green-100"
          : "bg-zinc-100 text-zinc-500 border-zinc-200",
      ].join(" ")}
    >
      <span
        className={[
          "w-1 h-1 rounded-full",
          active ? "bg-green-600" : "bg-zinc-400",
        ].join(" ")}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function KPI({ icon, iconWrap, title, value, hint, hintColor }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div
        className={[
          "w-12 h-12 rounded-full flex items-center justify-center",
          iconWrap,
        ].join(" ")}
      >
        <MIcon name={icon} className="text-[22px]" />
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          {title}
        </p>
        <p className="text-xl font-bold text-zinc-900">{value}</p>
        <p
          className={[
            "text-[10px] font-bold uppercase mt-0.5",
            hintColor,
          ].join(" ")}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}

function formatUpdated(updatedAt) {
  if (!updatedAt) return "-";
  const d = new Date(updatedAt);
  if (Number.isNaN(d.getTime())) return String(updatedAt);
  return d.toLocaleString();
}

export default function BrandsPortfolio() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | active | inactive

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch brands from API (server reads from tb_brands table)
  useEffect(() => {
    const controller = new AbortController();

    async function loadBrands() {
      try {
        setLoading(true);
        setErrorMsg("");

        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        params.set("status", status);

        // ✅ Use apiFetch so token/proxy works
        const res = await apiFetch(`/api/brands?${params.toString()}`, {
          signal: controller.signal,
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || "Failed to fetch brands");
        }

        // ✅ Normalize response to match UI fields (safe defaults)
        const normalized = (json.data || []).map((b) => ({
          id: b.id,
          name: b.name,
          route: b.route,
          status: b.status || "inactive",
          templates: Number.isFinite(b.templates) ? b.templates : 0,
          updatedAt: b.updatedAt || b.updated_at || b.updated,
          icon: b.icon || "business",
          iconBg: b.iconBg || b.icon_bg || "bg-zinc-100",
          iconColor: b.iconColor || b.icon_color || "text-zinc-500",
        }));

        setBrands(normalized);
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setErrorMsg(e?.message || "Something went wrong");
          setBrands([]);
        }
      } finally {
        setLoading(false);
      }
    }

    // small debounce for smoother typing
    const t = setTimeout(loadBrands, 250);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, status]);

  const filtered = useMemo(() => brands, [brands]);

  // ✅ KPI values from real data
  const totalCount = filtered.length;
  const activeCount = filtered.filter((b) => b.status === "active").length;
  const inactiveCount = totalCount - activeCount;
  const activeRate = totalCount
    ? ((activeCount / totalCount) * 100).toFixed(1)
    : "0.0";

  const showingFrom = totalCount ? 1 : 0;
  const showingTo = totalCount;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Heading row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Brand Portfolio</h2>
          <p className="text-zinc-500 text-sm">
            Managing {totalCount} active and inactive sub-brands.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <MIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              placeholder="Filter by name, route or status..."
              type="text"
            />
          </div>

          <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-1">
            <button
              onClick={() => setStatus("all")}
              className={[
                "px-3 py-1 text-xs font-medium rounded-md",
                status === "all"
                  ? "text-zinc-600 bg-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600",
              ].join(" ")}
            >
              All
            </button>
            <button
              onClick={() => setStatus("active")}
              className={[
                "px-3 py-1 text-xs font-medium rounded-md",
                status === "active"
                  ? "text-zinc-600 bg-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600",
              ].join(" ")}
            >
              Active
            </button>
            <button
              onClick={() => setStatus("inactive")}
              className={[
                "px-3 py-1 text-xs font-medium rounded-md",
                status === "inactive"
                  ? "text-zinc-600 bg-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600",
              ].join(" ")}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI
          icon="groups"
          iconWrap="bg-primary/10 text-primary"
          title="Total Brands"
          value={String(totalCount)}
          hint={`${activeCount} active • ${inactiveCount} inactive`}
          hintColor="text-zinc-600"
        />
        <KPI
          icon="check_circle"
          iconWrap="bg-blue-50 text-blue-500"
          title="Active Rate"
          value={`${activeRate}%`}
          hint="Portfolio Health"
          hintColor="text-blue-600"
        />
        <KPI
          icon="history"
          iconWrap="bg-amber-50 text-amber-500"
          title="Sync Status"
          value={loading ? "Syncing..." : "Up to date"}
          hint={errorMsg ? "API error" : "Last fetch OK"}
          hintColor={errorMsg ? "text-red-600" : "text-amber-600"}
        />
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-6 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Templates
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td className="px-6 py-6 text-sm text-zinc-500" colSpan={6}>
                  Loading brands...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-6 py-6 text-sm text-zinc-500" colSpan={6}>
                  No brands found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/brands/${b.id}`)}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "w-8 h-8 rounded flex items-center justify-center",
                          b.iconBg,
                        ].join(" ")}
                      >
                        <MIcon
                          name={b.icon}
                          className={["text-[18px]", b.iconColor].join(" ")}
                        />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">
                        {b.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-3">
                    <span className="text-sm font-mono text-zinc-500">
                      {b.route}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    <StatusPill status={b.status} />
                  </td>

                  <td className="px-6 py-3 text-sm text-zinc-600 font-medium">
                    {b.templates}
                  </td>

                  <td className="px-6 py-3 text-sm text-zinc-500">
                    {formatUpdated(b.updatedAt)}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                        title="Manage"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MIcon name="settings" className="text-[18px]" />
                      </button>

                      <button
                        className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                        title="Edit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MIcon name="edit" className="text-[18px]" />
                      </button>

                      <button
                        className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                        title="Duplicate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MIcon name="content_copy" className="text-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-zinc-900">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-900">{totalCount}</span>{" "}
            brands
          </span>

          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:bg-zinc-200 rounded transition-colors disabled:opacity-30"
              disabled
            >
              <MIcon name="chevron_left" className="text-[20px]" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center bg-primary text-white text-xs font-bold rounded">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 text-xs font-semibold rounded">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 text-xs font-semibold rounded">
              3
            </button>

            <span className="px-1 text-zinc-400">...</span>

            <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 text-xs font-semibold rounded">
              6
            </button>

            <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:bg-zinc-200 rounded transition-colors">
              <MIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
