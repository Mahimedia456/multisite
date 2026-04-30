import { useEffect, useMemo, useState } from "react";
import MIcon from "../components/MIcon";
import { apiFetch, getCurrentUser } from "../lib/auth";

function MessageBubble({ msg, isBrandAdmin }) {
  const [showTranslation, setShowTranslation] = useState(true);

  const support = msg.senderType === "SUPPORT";
  const mine = isBrandAdmin ? !support : support;

  const visibleText = showTranslation ? msg.translatedText : msg.originalText;

  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[72%] rounded-3xl p-4 shadow-sm",
          mine ? "bg-violet-600 text-white" : "bg-white text-zinc-900",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-black uppercase opacity-70">
            {support ? "Support" : "Brand"}
          </div>

          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className={[
              "rounded-full px-3 py-1 text-[10px] font-black uppercase",
              mine ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-600",
            ].join(" ")}
          >
            {showTranslation ? "Show Original" : "Show Translation"}
          </button>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
          {visibleText}
        </p>

        <div
          className={[
            "mt-3 rounded-2xl p-3 text-xs leading-5",
            mine ? "bg-white/15" : "bg-zinc-100",
          ].join(" ")}
        >
          <div className="mb-1 font-black opacity-70">
            {showTranslation ? "Translated text" : "Original text"}
          </div>

          <div className="opacity-80">
            {showTranslation
              ? `${msg.originalLanguage || "auto"} → ${
                  msg.translatedLanguage || "auto"
                }`
              : `${msg.originalLanguage || "auto"}`}
          </div>
        </div>

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

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return brands;

    return brands.filter((brand) => {
      return (
        String(brand.name || "").toLowerCase().includes(q) ||
        String(brand.slug || "").toLowerCase().includes(q) ||
        String(brand.route || "").toLowerCase().includes(q)
      );
    });
  }, [brands, query]);

  const threadByBrandId = useMemo(() => {
    const map = new Map();

    for (const thread of threads) {
      map.set(thread.brandId, thread);
    }

    return map;
  }, [threads]);

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading support chat...</div>;
  }

  return (
    <div className="mx-auto grid h-[calc(100vh-130px)] max-w-[1500px] grid-cols-[360px_1fr] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <aside className="border-r border-zinc-200 bg-zinc-50">
        <div className="border-b border-zinc-200 bg-white p-5">
          <h1 className="text-xl font-black text-zinc-950">Support Chat</h1>

          <p className="mt-1 text-sm text-zinc-500">
            {isSupportAdmin
              ? "All brand support threads."
              : "Your brand support thread."}
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

        <div className="h-[calc(100%-150px)] overflow-auto p-4">
          <div className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-400">
            {isSupportAdmin ? "Brand Threads" : "My Support Thread"}
          </div>

          <div className="space-y-2">
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
                        {brand.name}
                      </div>

                      <div className="mt-1 text-xs text-zinc-400">
                        {brand.slug}
                      </div>
                    </div>

                    <div
                      className={[
                        "rounded-full px-2 py-1 text-[10px] font-black uppercase",
                        thread
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-500",
                      ].join(" ")}
                    >
                      {thread ? "Open" : "New"}
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

      <main className="grid grid-rows-[auto_1fr_auto] bg-white">
        <div className="border-b border-zinc-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-black text-zinc-950">
                {selectedThread?.brandName ||
                  selectedThread?.brand_name ||
                  selectedThread?.subject ||
                  "Select a thread"}
              </div>

              <div className="mt-1 text-xs text-zinc-400">
                Smart translation toggle: original / translated
              </div>
            </div>

            {selectedThread ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
                {selectedThread.status || "OPEN"}
              </span>
            ) : null}
          </div>
        </div>

        <div className="overflow-auto bg-zinc-50 p-6">
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
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isBrandAdmin={isBrandAdmin}
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

        <div className="border-t border-zinc-200 bg-white p-4">
          <div className="flex gap-3">
            <textarea
              value={text}
              disabled={!selectedThread}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              placeholder={
                isSupportAdmin
                  ? "Type in English. Brand receives German translation..."
                  : "Schreiben Sie auf Deutsch. Support receives English translation..."
              }
              className="flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-violet-300"
            />

            <button
              type="button"
              disabled={!selectedThread || sending || !text.trim()}
              onClick={sendMessage}
              className="rounded-2xl bg-violet-600 px-6 text-sm font-black text-white disabled:opacity-40"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}