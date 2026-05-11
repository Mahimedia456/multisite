import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch, loginApi } from "../lib/auth";
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

function prefetchDashboardSummary() {
  apiFetch("/admin/dashboard-summary")
    .then((res) => res.json())
    .then((summary) => {
      if (summary?.ok) {
        sessionStorage.setItem(
          "dashboard_summary_cache",
          JSON.stringify({
            savedAt: Date.now(),
            data: summary.data,
          })
        );
      }
    })
    .catch(() => {});
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("aamir@mahimediasolutions.com");
  const [password, setPassword] = useState("mahimediasolutions");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim() && password.trim(),
    [email, password]
  );

  async function doLogin(nextEmail, nextPassword) {
    setError("");
    setLoading(true);

    try {
      sessionStorage.removeItem("dashboard_summary_cache");

      await loginApi(nextEmail, nextPassword, remember);

      prefetchDashboardSummary();

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
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center tracking-wide">
        {t("loginToPanel")}
      </h1>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => quickLogin("aamir@mahimediasolutions.com")}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm hover:bg-[#007ab3]/10"
        >
          {t("authLoginAdmin")}
        </button>

        <button
          type="button"
          onClick={() => quickLogin("allianz3@yopmail.com")}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm hover:bg-[#007ab3]/10"
        >
          {t("authLoginAllianz3")}
        </button>

        <button
          type="button"
          onClick={() => quickLogin("allianz4@yopmail.com")}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm hover:bg-[#007ab3]/10"
        >
          {t("authLoginAllianz4")}
        </button>
      </div>

      <div className="mt-10">
        <div className="rounded-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-black/5 dark:border-white/10 p-7">
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
                className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 text-sm outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                {t("authPassword")}
              </label>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 text-sm outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {t("authRememberDevice")}
              </span>

              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className={`w-12 h-7 rounded-full ${
                  remember ? "bg-[#007ab3]" : "bg-gray-300 dark:bg-slate-700"
                }`}
              />
            </div>

            {error ? <div className="text-red-600 text-sm">{error}</div> : null}

            <button
              disabled={!canSubmit || loading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white font-bold hover:brightness-105 transition disabled:opacity-60"
            >
              {loading ? t("authSigningIn") : t("authSignIn")}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-gray-500 dark:text-slate-400 hover:text-[#007ab3] font-semibold"
              >
                {t("authForgotPassword")}
              </button>

              <button
                type="button"
                onClick={() => alert(t("authRequestAccessLater"))}
                className="text-gray-500 dark:text-slate-400 hover:text-[#007ab3] font-semibold"
              >
                {t("authRequestAccess")}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-slate-400">
          🔒 {t("authEncrypted")}
        </div>
      </div>
    </div>
  );
}