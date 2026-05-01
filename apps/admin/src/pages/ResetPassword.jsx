import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();

  const email = params.get("email") || "";
  const otp = params.get("otp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => password.length >= 6 && confirmPassword.length >= 6,
    [password, confirmPassword]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("authPasswordsDoNotMatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/admin/reset-password", {
        method: "POST",
        body: { email, otp, password },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("authResetFailed"));
      }

      navigate("/login");
    } catch (e) {
      setError(e?.message || t("authResetFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 bg-[#f5f1fb] dark:bg-slate-950">
      <div className="pointer-events-none absolute -top-44 -left-52 w-[520px] h-[520px] rounded-full bg-violet-300/50 dark:bg-violet-900/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -right-44 w-[620px] h-[620px] rounded-full bg-violet-400/40 dark:bg-violet-800/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/80 dark:bg-slate-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 p-7 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {t("authResetTitle")}
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          {t("authResetDesc")}
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              {t("authNewPassword")}
            </label>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              {t("authConfirmPassword")}
            </label>

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-200 dark:focus:ring-violet-800"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            disabled={!canSubmit || loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-b from-violet-600 to-violet-700 text-white font-bold disabled:opacity-60"
          >
            {loading ? t("authResetting") : t("authResetPassword")}
          </button>
        </form>
      </div>
    </div>
  );
}