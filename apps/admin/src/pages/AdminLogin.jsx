import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginApi } from "../lib/auth";
import logo from "../assets/logo.svg";

function ShieldIcon() {
  return (
    <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-950 backdrop-blur flex items-center justify-center shadow-sm border border-black/5 dark:border-white/10">
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <path
          fill="currentColor"
          className="text-violet-700 dark:text-violet-300"
          d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4zm0 6a3 3 0 00-3 3c0 1.2.7 2.3 1.8 2.8V16a1.2 1.2 0 102.4 0v-2.2A3.2 3.2 0 0015 11a3 3 0 00-3-3z"
        />
      </svg>
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("aamir@mahimediasolutions.com");
  const [password, setPassword] = useState("mahimediasolutions");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email.trim() && password.trim(), [email, password]);

  async function doLogin(nextEmail, nextPassword) {
    setError("");
    setLoading(true);

    try {
      await loginApi(nextEmail, nextPassword, remember);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || t("authLoginFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function quickLogin(nextEmail) {
    const nextPassword = "mahimediasolutions";
    setEmail(nextEmail);
    setPassword(nextPassword);
    setTimeout(() => doLogin(nextEmail, nextPassword), 0);
  }

  async function onSubmit(e) {
    e.preventDefault();
    await doLogin(email, password);
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#f5f1fb] dark:bg-slate-950">
      <div className="pointer-events-none absolute -top-44 -left-52 w-[520px] h-[520px] rounded-full bg-violet-300/50 dark:bg-violet-900/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -right-44 w-[620px] h-[620px] rounded-full bg-violet-400/40 dark:bg-violet-800/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40 dark:from-slate-950/70 dark:via-slate-950/40 dark:to-slate-950/80" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
<h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">
  {t("loginToPanel")}
</h1>
       

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => quickLogin("aamir@mahimediasolutions.com")}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/70 dark:bg-slate-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-slate-800"
          >
            {t("authLoginAdmin")}
          </button>

          <button
            type="button"
            onClick={() => quickLogin("allianz3@yopmail.com")}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/70 dark:bg-slate-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-slate-800"
          >
            {t("authLoginAllianz3")}
          </button>

          <button
            type="button"
            onClick={() => quickLogin("allianz4@yopmail.com")}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/70 dark:bg-slate-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-slate-800"
          >
            {t("authLoginAllianz4")}
          </button>
        </div>

        <div className="mt-10 w-full max-w-md">
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 p-7">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {t("authAdminEmail")}
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  type="email"
                  autoComplete="email"
                  className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {t("authPassword")}
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-300"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t("authRememberDevice")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {t("authStaySignedIn")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRemember((v) => !v)}
                  className={[
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    remember ? "bg-violet-600" : "bg-gray-200 dark:bg-slate-700",
                  ].join(" ")}
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
                {loading ? t("authSigningIn") : t("authSignIn")} →
              </button>

              <div className="pt-1 flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white font-semibold"
                  onClick={() => navigate("/forgot-password")}
                >
                  {t("authForgotPassword")}
                </button>

                <button
                  type="button"
                  className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white font-semibold"
                  onClick={() => alert(t("authRequestAccessLater"))}
                >
                  {t("authRequestAccess")}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-slate-900 backdrop-blur border border-black/5 dark:border-white/10 px-4 py-2 text-xs text-gray-600 dark:text-slate-300 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              {t("authEncrypted")}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {t("authTwoFactorNotice")}
          </p>
        </div>
      </div>
    </div>
  );
}