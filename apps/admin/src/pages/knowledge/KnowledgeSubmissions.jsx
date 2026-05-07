import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";

export default function KnowledgeSubmissions() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusSaving, setStatusSaving] = useState("");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [items]);

  async function loadItems() {
    setLoading(true);

    try {
      const res = await apiFetch("/admin/knowledge/submissions");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeSubmissionsFailedLoad"));
      }

      setItems(json.data || []);
    } catch (e) {
      alert(e.message || t("knowledgeSubmissionsFailedLoad"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function updateStatus(item, status) {
    setStatusSaving(item.id);

    try {
      const res = await apiFetch(`/admin/knowledge/submissions/${item.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeSubmissionsFailedUpdate"));
      }

      await loadItems();

      if (selected?.id === item.id) {
        setSelected({
          ...selected,
          status,
        });
      }
    } catch (e) {
      alert(e.message || t("knowledgeSubmissionsFailedUpdate"));
    } finally {
      setStatusSaving("");
    }
  }

  function formatDate(value) {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function renderData(data) {
    if (!data || typeof data !== "object") return null;

    return Object.entries(data).map(([key, value]) => (
      <div
        key={key}
        className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
      >
        <div className="text-xs font-black uppercase tracking-wider text-[#007ab3]">
          {key}
        </div>
        <div className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-700 dark:text-slate-200">
          {String(value ?? "-")}
        </div>
      </div>
    ));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("knowledgeArea")}
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {t("knowledgeSubmissions")}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("knowledgeSubmissionsPageSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={loadItems}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
          >
            <MIcon name="refresh" className="text-xl" />
            {t("knowledgeRefresh")}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 xl:col-span-2">
          {loading ? (
            <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
              {t("knowledgeSubmissionsLoading")}
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
              {t("knowledgeNoSubmissions")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-300">
                  <tr>
                    <th className="px-5 py-4">{t("knowledgeUser")}</th>
                    <th className="px-5 py-4">{t("knowledgeSubject")}</th>
                    <th className="px-5 py-4">{t("knowledgeStatus")}</th>
                    <th className="px-5 py-4">{t("knowledgeEmailSent")}</th>
                    <th className="px-5 py-4">{t("knowledgeCreatedAt")}</th>
                    <th className="px-5 py-4 text-right">{t("knowledgeActions")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {sortedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-white/5"
                    >
                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900 dark:text-white">
                          {item.full_name || "-"}
                        </div>
                        <div className="mt-1 text-xs font-bold text-slate-400">
                          {item.email || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                        {item.subject || item.message || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={item.status || "new"}
                          disabled={statusSaving === item.id}
                          onChange={(e) => updateStatus(item, e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                        >
                          <option value="new">{t("knowledgeSubmissionStatusNew")}</option>
                          <option value="in_progress">
                            {t("knowledgeSubmissionStatusInProgress")}
                          </option>
                          <option value="resolved">
                            {t("knowledgeSubmissionStatusResolved")}
                          </option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#007ab3]/10 px-3 py-1 text-xs font-black text-[#007ab3]">
                          {item.email_sent ? t("knowledgeYes") : t("knowledgeNo")}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelected(item)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                          >
                            {t("knowledgeView")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          {!selected ? (
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                <MIcon name="inbox" className="text-3xl" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
                {t("knowledgeSubmissionDetail")}
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
                {t("knowledgeSelectSubmission")}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    {selected.full_name || t("knowledgeSubmissionDetail")}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                    {selected.email || "-"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {t("knowledgeClose")}
                </button>
              </div>

              <div className="rounded-2xl bg-[#007ab3]/10 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#007ab3]">
                  {t("knowledgeEmailTo")}
                </div>
                <div className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {selected.email_to || "aamir@mahimediasolutions.com"}
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {t("knowledgePhone")}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selected.phone || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {t("knowledgeSubject")}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selected.subject || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {t("knowledgeMessage")}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                    {selected.message || "-"}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  {t("knowledgeSubmittedData")}
                </div>

                <div className="space-y-3">{renderData(selected.data_json)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}