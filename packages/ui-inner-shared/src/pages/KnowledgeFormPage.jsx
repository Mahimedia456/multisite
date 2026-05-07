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
        setSubmitError(lang === "en" ? "Please fill all required fields." : "Bitte füllen Sie alle Pflichtfelder aus.");
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
        subject: values.subject || values.betreff || pickLang(form, "title", lang),
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
      setSubmitError(e.message || (lang === "en" ? "Form could not be submitted." : "Formular konnte nicht gesendet werden."));
    } finally {
      setSending(false);
    }
  }

  function renderField(field) {
    const name = field.name;
    const placeholder = pickLang(field, "placeholder", lang);
    const value = values[name] || "";

    const baseClass =
      "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#007ab3]";

    if (field.type === "textarea") {
      return <textarea rows={5} value={value} required={field.required} placeholder={placeholder} onChange={(e) => updateValue(name, e.target.value)} className={baseClass} />;
    }

    if (field.type === "select") {
      return (
        <select value={value} required={field.required} onChange={(e) => updateValue(name, e.target.value)} className={baseClass}>
          <option value="">{lang === "en" ? "Please select" : "Bitte auswählen"}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    return <input type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"} value={value} required={field.required} placeholder={placeholder} onChange={(e) => updateValue(name, e.target.value)} className={baseClass} />;
  }

  if (!form) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          {lang === "en" ? "Form not found." : "Formular nicht gefunden."}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f8fb]">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Link to="/knowledge" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#007ab3] shadow-sm">
          ← {lang === "en" ? "Back to Knowledge Area" : "Zurück zum Wissensbereich"}
        </Link>

        <div className="mt-8 rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
            {lang === "en" ? "Form" : "Formular"}
          </div>

          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950">
            {pickLang(form, "title", lang)}
          </h1>

          {successMessage ? <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-5 text-sm font-bold leading-6 text-green-700">{successMessage}</div> : null}
          {submitError ? <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm font-bold leading-6 text-red-700">{submitError}</div> : null}

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            {fields.map((field) => (
              <label key={field.name} className="block space-y-2">
                <span className="text-sm font-black text-slate-700">
                  {pickLang(field, "label", lang) || field.name}
                  {field.required ? <span className="text-red-500"> *</span> : null}
                </span>
                {renderField(field)}
              </label>
            ))}

            <button type="submit" disabled={sending} className="inline-flex w-full items-center justify-center rounded-2xl bg-[#007ab3] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c] disabled:cursor-not-allowed disabled:opacity-60">
              {sending ? (lang === "en" ? "Sending..." : "Wird gesendet...") : lang === "en" ? "Submit" : "Absenden"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}