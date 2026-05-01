import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../lib/auth";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();

  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const canSubmit = useMemo(() => otp.trim().length >= 4, [otp]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await apiFetch("/admin/verify-otp", {
        method: "POST",
        body: { email, otp },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("authVerifyFailed"));
      }

      navigate(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );
    } catch (e) {
      setError(e?.message || t("authVerifyFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const res = await apiFetch("/admin/resend-otp", {
        method: "POST",
        body: { email },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("authResendFailed"));
      }

      setSuccess(t("authOtpResent"));

      if (json?.devOtp) {
        console.log("DEV OTP:", json.devOtp);
      }
    } catch (e) {
      setError(e?.message || t("authResendFailed"));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 p-7 shadow-2xl">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        {t("authVerifyOtpTitle")}
      </h1>

      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
        {t("authVerifyOtpDesc")}{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {email}
        </span>
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            {t("authOtpCode")}
          </label>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mt-2 w-full h-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20"
          />
        </div>

        {success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          disabled={!canSubmit || loading}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white font-bold disabled:opacity-60 hover:brightness-105 transition"
        >
          {loading ? t("authVerifying") : t("authVerifyOtp")}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="w-full text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-[#007ab3] transition disabled:opacity-60"
        >
          {resending ? t("authResendingOtp") : t("authResendOtp")}
        </button>
      </form>
    </div>
  );
}