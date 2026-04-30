import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    setLoading(true);

    try {
      const res = await apiFetch("/admin/support-chat/notifications");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load notifications");
      }

      setItems(json.data || []);
    } catch (e) {
      alert(e.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading notifications...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-950">Notifications</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Unread support chat messages.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        {items.length ? (
          <div className="divide-y divide-zinc-100">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate("/support-chat")}
                className="flex w-full items-start gap-4 p-5 text-left hover:bg-violet-50"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-600">
                  <MIcon name="chat" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-black text-zinc-950">
                    {item.brandName}
                  </div>

                  <div className="mt-1 line-clamp-2 text-sm text-zinc-600">
                    {item.translatedText || item.originalText}
                  </div>

                  <div className="mt-2 text-xs text-zinc-400">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                  Unread
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-400">
            <MIcon name="notifications_off" className="text-[44px]" />
            <p className="mt-3 text-sm font-bold">No unread notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}