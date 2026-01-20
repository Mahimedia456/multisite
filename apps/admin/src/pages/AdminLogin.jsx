import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../lib/auth";

function ShieldIcon() {
  return (
    <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-sm border border-black/5">
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <path
          fill="currentColor"
          className="text-violet-700"
          d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4zm0 6a3 3 0 00-3 3c0 1.2.7 2.3 1.8 2.8V16a1.2 1.2 0 102.4 0v-2.2A3.2 3.2 0 0015 11a3 3 0 00-3-3z"
        />
      </svg>
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aamir@mahimediasolutions.com");
  const [password, setPassword] = useState("mahimediasolutions");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim() && password.trim(),
    [email, password]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // tiny UX delay (optional)
    await new Promise((r) => setTimeout(r, 250));

    const res = await loginApi(email, password, remember);

    setLoading(false);

    if (!res.ok) {
      setError(res.error || "Login failed.");
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#f5f1fb]">
      <div className="pointer-events-none absolute -top-44 -left-52 w-[520px] h-[520px] rounded-full bg-violet-300/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -right-44 w-[620px] h-[620px] rounded-full bg-violet-400/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <ShieldIcon />

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900">
          Admin Portal
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Insurance Holding Co. Management
        </p>

        <div className="mt-10 w-full max-w-md">
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/10 border border-black/5 p-7">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Admin Email
                </label>
                <div className="mt-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    type="email"
                    autoComplete="email"
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-white/70 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-white/70 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Remember this device
                  </p>
                  <p className="text-xs text-gray-500">
                    Stay signed in for 30 days
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRemember((v) => !v)}
                  className={[
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    remember ? "bg-violet-600" : "bg-gray-200",
                  ].join(" ")}
                  aria-pressed={remember}
                  aria-label="Remember this device"
                >
                  <span
                    className={[
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow",
                      remember ? "translate-x-6" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                disabled={!canSubmit || loading}
                className={[
                  "w-full h-12 rounded-2xl text-white font-bold text-sm shadow-xl shadow-violet-500/25 transition-all",
                  "bg-gradient-to-b from-violet-600 to-violet-700 hover:brightness-105 active:brightness-95",
                  !canSubmit || loading ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {loading ? "Signing In..." : "Sign In"}
                  <span aria-hidden className="text-base">
                    →
                  </span>
                </span>
              </button>

              {/* ✅ Removed Forgot Password (as requested) */}
              <div className="pt-1 flex items-center justify-end text-sm">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 font-semibold"
                  onClick={() => alert("Hook this to request-access flow later.")}
                >
                  Request Access
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur border border-black/5 px-4 py-2 text-xs text-gray-600 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-gray-500">
                lock
              </span>
              Protected by 256-bit encryption
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Notice: Two-factor authentication (2FA) will be required upon
            successful credential entry for all admin sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
