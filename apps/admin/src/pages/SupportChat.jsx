import { useEffect, useMemo, useState } from "react";
import MIcon from "../components/MIcon";
import { apiFetch, getCurrentUser } from "../lib/auth";

function getVisibleMessageText(msg, isSupportAdmin) {
  const support = msg.senderType === "SUPPORT";

  if (isSupportAdmin) {
    return support ? msg.originalText : msg.translatedText;
  }

  return support ? msg.translatedText : msg.originalText;
}

function MessageBubble({ msg, isSupportAdmin }) {
  const support = msg.senderType === "SUPPORT";
  const mine = isSupportAdmin ? support : !support;
  const visibleText = getVisibleMessageText(msg, isSupportAdmin);

  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[72%] rounded-3xl p-4 shadow-sm",
          mine ? "bg-violet-600 text-white" : "bg-white text-zinc-900",
        ].join(" ")}
      >
        <div className="text-xs font-black uppercase opacity-70">
          {support ? "Support" : "Brand"}
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
          {visibleText}
        </p>

        <div className="mt-2 text-[10px] opacity-60">
          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
}

export default function SupportChat() {
  const user = getCurrentUser();

  const isSupportAdmin =
    String(user?.email || "").toLowerCase() ===
    "support@mahimediasolutions.com";

  const isBrandAdmin = !isSupportAdmin;

  const [brands, setBrands] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);

  const [query, setQuery] = useState("");
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function readJson(res) {
    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      throw new Error(json?.message || "Request failed");
    }

    return json;
  }

  async function loadBrands() {
    const res = await apiFetch("/admin/support-chat/brands");
    const json = await readJson(res);
    setBrands(json.data || []);
  }

  async function loadThreads() {
    const res = await apiFetch("/admin/support-chat/threads");
    const json = await readJson(res);
    setThreads(json.data || []);

    if (isBrandAdmin && json.data?.[0] && !selectedThread) {
      setSelectedThread(json.data[0]);
      await loadMessages(json.data[0].id);
    }
  }

  async function createThread(brandId) {
    const res = await apiFetch("/admin/support-chat/threads", {
      method: "POST",
      body: { brandId },
    });

    const json = await readJson(res);
    await loadThreads();

    const nextThread = {
      ...json.data.thread,
      brandName: json.data.brand?.name,
      brandSlug: json.data.brand?.slug,
      brandId: json.data.brand?.id,
    };

    setSelectedThread(nextThread);
    await loadMessages(json.data.thread.id);
  }

  async function selectThread(thread) {
    setSelectedThread(thread);
    await loadMessages(thread.id);
    await loadThreads();
  }

  async function loadMessages(threadId) {
    const res = await apiFetch(
      `/admin/support-chat/threads/${threadId}/messages`
    );

    const json = await readJson(res);
    setMessages(json.data || []);
  }

  async function sendMessage() {
    const clean = text.trim();
    if (!clean || !selectedThread?.id) return;

    setSending(true);

    try {
      const res = await apiFetch(
        `/admin/support-chat/threads/${selectedThread.id}/messages`,
        {
          method: "POST",
          body: { text: clean },
        }
      );

      await readJson(res);
      setText("");
      await loadMessages(selectedThread.id);
      await loadThreads();
    } catch (e) {
      alert(e?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function boot() {
    setLoading(true);

    try {
      await Promise.all([loadBrands(), loadThreads()]);
    } catch (e) {
      alert(e?.message || "Failed to load support chat");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    boot();
  }, []);

  useEffect(() => {
    if (!selectedThread?.id) return;

    const timer = setInterval(() => {
      loadMessages(selectedThread.id).catch(() => {});
      loadThreads().catch(() => {});
    }, 5000);

    return () => clearInterval(timer);
  }, [selectedThread?.id]);

  const threadByBrandId = useMemo(() => {
    const map = new Map();

    for (const thread of threads) {
      map.set(thread.brandId, thread);
    }

    return map;
  }, [threads]);

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = !q
      ? brands
      : brands.filter((brand) => {
          return (
            String(brand.name || "").toLowerCase().includes(q) ||
            String(brand.slug || "").toLowerCase().includes(q) ||
            String(brand.route || "").toLowerCase().includes(q)
          );
        });

    return [...list].sort((a, b) => {
      const ta = threadByBrandId.get(a.id);
      const tb = threadByBrandId.get(b.id);

      const da = ta?.lastMessageAt || ta?.updatedAt || a.updatedAt || "";
      const db = tb?.lastMessageAt || tb?.updatedAt || b.updatedAt || "";

      return new Date(db).getTime() - new Date(da).getTime();
    });
  }, [brands, query, threadByBrandId]);

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading support chat...</div>;
  }

  return (
   <div className="h-[calc(100vh-112px)] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
  <div className="grid h-full min-h-0 grid-cols-[360px_1fr]">
        <aside className="flex min-h-0 flex-col border-r border-zinc-200 bg-zinc-50">
          <div className="shrink-0 border-b border-zinc-200 bg-white p-5">
            <h1 className="text-xl font-black text-zinc-950">Support Chat</h1>

            <p className="mt-1 text-sm text-zinc-500">
              {isSupportAdmin
                ? "All brand support threads."
                : "Your support thread with admin."}
            </p>

            {isSupportAdmin ? (
              <div className="mt-4 flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4">
                <MIcon name="search" className="text-[20px] text-zinc-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brands..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
              </div>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-400">
              {isSupportAdmin ? "Brand Threads" : "Support Admin"}
            </div>

            <div className="space-y-2 pb-4">
              {filteredBrands.map((brand) => {
                const thread = threadByBrandId.get(brand.id);
                const active =
                  selectedThread?.brandId === brand.id ||
                  selectedThread?.brand_id === brand.id;

                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() =>
                      thread ? selectThread(thread) : createThread(brand.id)
                    }
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition",
                      active
                        ? "border-violet-300 bg-violet-50"
                        : "border-zinc-200 bg-white hover:border-violet-200 hover:bg-violet-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-zinc-900">
                          {isBrandAdmin ? "Support Admin" : brand.name}
                        </div>

                        <div className="mt-1 text-xs text-zinc-400">
                          {isBrandAdmin
                            ? "support@mahimediasolutions.com"
                            : brand.slug}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {thread?.unreadCount > 0 ? (
                          <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                            {thread.unreadCount > 99
                              ? "99+"
                              : thread.unreadCount}
                          </span>
                        ) : null}

                        <span
                          className={[
                            "rounded-full px-2 py-1 text-[10px] font-black uppercase",
                            thread
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-zinc-100 text-zinc-500",
                          ].join(" ")}
                        >
                          {thread ? "Open" : "New"}
                        </span>
                      </div>
                    </div>

                    {thread?.lastMessage ? (
                      <div className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-500">
                        {thread.lastMessage}
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-zinc-400">
                        No messages yet
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col bg-white">
          <div className="shrink-0 border-b border-zinc-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-black text-zinc-950">
                  {isBrandAdmin
                    ? "Support Admin"
                    : selectedThread?.brandName ||
                      selectedThread?.brand_name ||
                      selectedThread?.subject ||
                      "Select a thread"}
                </div>

                <div className="mt-1 text-xs text-zinc-400">
                  {isSupportAdmin
                    ? "Support sees brand messages in English."
                    : "Brand sees every message in German."}
                </div>
              </div>

              {selectedThread ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
                  {selectedThread.status || "OPEN"}
                </span>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-50 p-6">
            {!selectedThread ? (
              <div className="grid h-full place-items-center text-center text-zinc-400">
                <div>
                  <MIcon name="forum" className="text-[52px]" />
                  <p className="mt-3 text-sm font-bold">
                    Select a thread to open chat.
                  </p>
                </div>
              </div>
            ) : messages.length ? (
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isSupportAdmin={isSupportAdmin}
                  />
                ))}
              </div>
            ) : (
              <div className="grid h-full place-items-center text-center text-zinc-400">
                <div>
                  <MIcon name="chat_bubble" className="text-[42px]" />
                  <p className="mt-3 text-sm font-bold">No messages yet.</p>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-zinc-200 bg-white p-4">
            {selectedThread ? (
              <div className="flex gap-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder={
                    isSupportAdmin
                      ? "Type in English. Brand will see German..."
                      : "Schreiben Sie auf Deutsch. Support will see English..."
                  }
                  className="min-h-[56px] flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-violet-300"
                />

                <button
                  type="button"
                  disabled={sending || !text.trim()}
                  onClick={sendMessage}
                  className="min-w-[100px] rounded-2xl bg-violet-600 px-6 text-sm font-black text-white disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Reply"}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-50 px-4 py-4 text-sm text-zinc-400">
                Select a thread to reply.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}