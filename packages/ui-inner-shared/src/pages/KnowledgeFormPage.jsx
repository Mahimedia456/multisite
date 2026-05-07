import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function pickLang(item, key, lang = "de") {
  return item?.[`${key}_${lang}`] || item?.[`${key}_de`] || item?.[`${key}_en`] || "";
}

export default function KnowledgeFormPage({ lang = "de", form, onSubmit }) {
  const fields = useMemo(() => {
    return Array.isArray(form?.fields_json) ? form.fields_json : [];
  }, [form]);

  const [values, setValues] = useState({});
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  function updateValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function submitForm(e) {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    for (const field of fields) {
      if (field.required && !String(values[field.name] || "").trim()) {
        setSubmitError(
          lang === "en"
            ? "Please fill all required fields."
            : "Bitte füllen Sie alle Pflichtfelder aus."
        );
        return;
      }
    }

    setSending(true);

    try {
      const result = await onSubmit?.({
        data: values,
        full_name: values.full_name || values.name || "",
        email: values.email || "",
        phone: values.phone || values.telefon || "",
        subject:
          values.subject ||
          values.betreff ||
          pickLang(form, "title", lang),
        message: values.message || values.nachricht || "",
      });

      setSuccessMessage(
        result?.message ||
          pickLang(form, "success_message", lang) ||
          (lang === "en"
            ? "Thank you. Your request has been submitted successfully."
            : "Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.")
      );

      setValues({});
    } catch (e) {
      setSubmitError(
        e.message ||
          (lang === "en"
            ? "Form could not be submitted."
            : "Formular konnte nicht gesendet werden.")
      );
    } finally {
      setSending(false);
    }
  }

  function renderField(field) {
    const name = field.name;
    const placeholder = pickLang(field, "placeholder", lang);
    const value = values[name] || "";

    const baseClass =
      "w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

    if (field.type === "textarea") {
      return (
        <textarea
          rows={5}
          value={value}
          required={field.required}
          placeholder={placeholder}
          onChange={(e) => updateValue(name, e.target.value)}
          className={baseClass}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={value}
          required={field.required}
          onChange={(e) => updateValue(name, e.target.value)}
          className={baseClass}
        >
          <option value="">
            {lang === "en" ? "Please select" : "Bitte auswählen"}
          </option>

          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={
          field.type === "email"
            ? "email"
            : field.type === "phone"
              ? "tel"
              : "text"
        }
        value={value}
        required={field.required}
        placeholder={placeholder}
        onChange={(e) => updateValue(name, e.target.value)}
        className={baseClass}
      />
    );
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-[#f5f8f8] text-slate-900">
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm font-bold text-red-700">
            {lang === "en" ? "Form not found." : "Formular nicht gefunden."}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-slate-900">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>←</span>
            {lang === "en" ? "Back to Knowledge Area" : "Zurück zum Wissensbereich"}
          </Link>

          <div className="mt-10">
            <div className="mb-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              {lang === "en" ? "Form" : "Formular"}
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              {pickLang(form, "title", lang)}
            </h1>

            {pickLang(form, "description", lang) ? (
              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600">
                {pickLang(form, "description", lang)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          {successMessage ? (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm font-bold leading-6 text-green-700">
              {successMessage}
            </div>
          ) : null}

          {submitError ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold leading-6 text-red-700">
              {submitError}
            </div>
          ) : null}

          <form onSubmit={submitForm} className="space-y-6">
            {fields.map((field) => (
              <label key={field.name} className="block space-y-2">
                <span className="text-sm font-black text-slate-700">
                  {pickLang(field, "label", lang) || field.name}
                  {field.required ? (
                    <span className="text-red-500"> *</span>
                  ) : null}
                </span>

                {renderField(field)}
              </label>
            ))}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending
                ? lang === "en"
                  ? "Sending..."
                  : "Wird gesendet..."
                : lang === "en"
                  ? "Submit"
                  : "Absenden"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}