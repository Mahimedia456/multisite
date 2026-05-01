import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../lib/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/admin/forgot-password", {
        method: "POST",
        body: { email },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("authForgotFailed"));
      }

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (e) {
      setError(e?.message || t("authForgotFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="w-full max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 p-7 shadow-2xl">
    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
      {t("authForgotTitle")}
    </h1>

    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
      {t("authForgotDesc")}
    </p>

    <form onSubmit={onSubmit} className="mt-7 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
          {t("authEmail")}
        </label>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="name@company.com"
          className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        disabled={loading}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white font-bold disabled:opacity-60"
      >
        {loading ? t("authSendingOtp") : t("authSendOtp")}
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="w-full text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-[#007ab3]"
      >
        {t("authBackToLogin")}
      </button>
    </form>
  </div>
);
}