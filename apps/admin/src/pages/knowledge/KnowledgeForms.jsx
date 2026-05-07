import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";

const EMPTY_FIELD = {
  label_de: "",
  label_en: "",
  name: "",
  type: "text",
  required: false,
  placeholder_de: "",
  placeholder_en: "",
  options: "",
};

const EMPTY_FORM = {
  title_de: "",
  title_en: "",
  slug: "",
  type: "support",
  fields_json: [],
  success_message_de: "",
  success_message_en: "",
  status: "active",
  sort_order: 0,
};

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function KnowledgeForms() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const orderA = Number(a.sort_order || 0);
      const orderB = Number(b.sort_order || 0);

      if (orderA !== orderB) return orderA - orderB;

      return String(a.title_de || "").localeCompare(String(b.title_de || ""));
    });
  }, [items]);

  async function loadItems() {
    setLoading(true);

    try {
      const res = await apiFetch("/admin/knowledge/forms");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeFormsFailedLoad"));
      }

      setItems(json.data || []);
    } catch (e) {
      alert(e.message || t("knowledgeFormsFailedLoad"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function normalizeFields(fields) {
    if (!Array.isArray(fields)) return [];

    return fields.map((field) => ({
      label_de: field.label_de || "",
      label_en: field.label_en || "",
      name: field.name || "",
      type: field.type || "text",
      required: Boolean(field.required),
      placeholder_de: field.placeholder_de || "",
      placeholder_en: field.placeholder_en || "",
      options: Array.isArray(field.options) ? field.options.join("\n") : "",
    }));
  }

  function prepareFields(fields) {
    return fields
      .filter((field) => field.label_de || field.name)
      .map((field) => ({
        label_de: field.label_de,
        label_en: field.label_en,
        name: field.name || makeSlug(field.label_de).replaceAll("-", "_"),
        type: field.type || "text",
        required: Boolean(field.required),
        placeholder_de: field.placeholder_de,
        placeholder_en: field.placeholder_en,
        options: String(field.options || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      }));
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      fields_json: [
        {
          ...EMPTY_FIELD,
          label_de: "Name",
          label_en: "Name",
          name: "full_name",
          required: true,
        },
        {
          ...EMPTY_FIELD,
          label_de: "E-Mail",
          label_en: "Email",
          name: "email",
          type: "email",
          required: true,
        },
        {
          ...EMPTY_FIELD,
          label_de: "Nachricht",
          label_en: "Message",
          name: "message",
          type: "textarea",
          required: true,
        },
      ],
    });
    setShowForm(true);
  }

  function openEdit(item) {
    setEditingId(item.id);

    setForm({
      title_de: item.title_de || "",
      title_en: item.title_en || "",
      slug: item.slug || "",
      type: item.type || "support",
      fields_json: normalizeFields(item.fields_json),
      success_message_de: item.success_message_de || "",
      success_message_en: item.success_message_en || "",
      status: item.status || "active",
      sort_order: Number(item.sort_order || 0),
    });

    setShowForm(true);
  }

  function closeForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function updateField(name, value) {
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "title_de" && !editingId) {
        next.slug = makeSlug(value);
      }

      return next;
    });
  }

  function addFormField() {
    setForm((prev) => ({
      ...prev,
      fields_json: [...prev.fields_json, { ...EMPTY_FIELD }],
    }));
  }

  function updateFormField(index, key, value) {
    setForm((prev) => ({
      ...prev,
      fields_json: prev.fields_json.map((field, fieldIndex) =>
        fieldIndex === index
          ? {
              ...field,
              [key]: value,
              ...(key === "label_de" && !field.name
                ? { name: makeSlug(value).replaceAll("-", "_") }
                : {}),
            }
          : field
      ),
    }));
  }

  function removeFormField(index) {
    setForm((prev) => ({
      ...prev,
      fields_json: prev.fields_json.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  }

  async function saveItem(e) {
    e.preventDefault();

    if (!form.title_de.trim()) {
      alert(t("knowledgeFormTitleDeRequired"));
      return;
    }

    if (!form.slug.trim()) {
      alert(t("knowledgeSlugRequired"));
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        slug: makeSlug(form.slug),
        sort_order: Number(form.sort_order || 0),
        fields_json: prepareFields(form.fields_json),
      };

      const res = await apiFetch(
        editingId ? `/admin/knowledge/forms/${editingId}` : "/admin/knowledge/forms",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeFormsFailedSave"));
      }

      await loadItems();
      closeForm();
    } catch (e) {
      alert(e.message || t("knowledgeFormsFailedSave"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    const ok = window.confirm(
      t("knowledgeFormDeleteConfirm", {
        title: item.title_de || item.slug,
      })
    );

    if (!ok) return;

    try {
      const res = await apiFetch(`/admin/knowledge/forms/${item.id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeFormsFailedDelete"));
      }

      await loadItems();
    } catch (e) {
      alert(e.message || t("knowledgeFormsFailedDelete"));
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("knowledgeArea")}
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {t("knowledgeForms")}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("knowledgeFormsPageSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
          >
            <MIcon name="add" className="text-xl" />
            {t("knowledgeAddForm")}
          </button>
        </div>
      </div>

      {showForm ? (
        <form
          onSubmit={saveItem}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">
              {editingId ? t("knowledgeEditForm") : t("knowledgeAddForm")}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              {t("knowledgeCancel")}
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeFormTitleDe")}
              </span>
              <input
                value={form.title_de}
                onChange={(e) => updateField("title_de", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeFormTitleEn")}
              </span>
              <input
                value={form.title_en}
                onChange={(e) => updateField("title_en", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeSlug")}
              </span>
              <input
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeFormType")}
              </span>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                <option value="support">{t("knowledgeFormTypeSupport")}</option>
                <option value="complaint">{t("knowledgeFormTypeComplaint")}</option>
                <option value="request">{t("knowledgeFormTypeRequest")}</option>
                <option value="custom">{t("knowledgeFormTypeCustom")}</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeStatus")}
              </span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                <option value="active">{t("knowledgeActive")}</option>
                <option value="inactive">{t("knowledgeInactive")}</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeSortOrder")}
              </span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeSuccessMessageDe")}
              </span>
              <textarea
                rows={3}
                value={form.success_message_de}
                onChange={(e) => updateField("success_message_de", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeSuccessMessageEn")}
              </span>
              <textarea
                rows={3}
                value={form.success_message_en}
                onChange={(e) => updateField("success_message_en", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>

          <div className="mt-8 rounded-[24px] border border-slate-200 p-5 dark:border-white/10">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {t("knowledgeFormFields")}
              </h3>

              <button
                type="button"
                onClick={addFormField}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#007ab3]/30 px-4 py-2 text-sm font-black text-[#007ab3] hover:bg-[#007ab3]/10"
              >
                <MIcon name="add" className="text-xl" />
                {t("knowledgeAddField")}
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {form.fields_json.map((field, index) => (
                <div
                  key={index}
                  className="rounded-[22px] border border-slate-200 p-4 dark:border-white/10"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="text-sm font-black text-slate-600 dark:text-slate-200">
                      {t("knowledgeField")} #{index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFormField(index)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      {t("knowledgeDelete")}
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={field.label_de}
                      onChange={(e) =>
                        updateFormField(index, "label_de", e.target.value)
                      }
                      placeholder={t("knowledgeFieldLabelDe")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    />

                    <input
                      value={field.label_en}
                      onChange={(e) =>
                        updateFormField(index, "label_en", e.target.value)
                      }
                      placeholder={t("knowledgeFieldLabelEn")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    />

                    <input
                      value={field.name}
                      onChange={(e) => updateFormField(index, "name", e.target.value)}
                      placeholder={t("knowledgeFieldName")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    />

                    <select
                      value={field.type}
                      onChange={(e) => updateFormField(index, "type", e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="text">{t("knowledgeFieldTypeText")}</option>
                      <option value="email">{t("knowledgeFieldTypeEmail")}</option>
                      <option value="phone">{t("knowledgeFieldTypePhone")}</option>
                      <option value="textarea">{t("knowledgeFieldTypeTextarea")}</option>
                      <option value="select">{t("knowledgeFieldTypeSelect")}</option>
                    </select>

                    <input
                      value={field.placeholder_de}
                      onChange={(e) =>
                        updateFormField(index, "placeholder_de", e.target.value)
                      }
                      placeholder={t("knowledgePlaceholderDe")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    />

                    <input
                      value={field.placeholder_en}
                      onChange={(e) =>
                        updateFormField(index, "placeholder_en", e.target.value)
                      }
                      placeholder={t("knowledgePlaceholderEn")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                    />

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateFormField(index, "required", e.target.checked)
                        }
                      />
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {t("knowledgeRequired")}
                      </span>
                    </label>

                    {field.type === "select" ? (
                      <textarea
                        rows={3}
                        value={field.options}
                        onChange={(e) =>
                          updateFormField(index, "options", e.target.value)
                        }
                        placeholder={t("knowledgeFieldOptionsPlaceholder")}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MIcon name="save" className="text-xl" />
              {saving ? t("knowledgeSaving") : t("knowledgeSave")}
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        {loading ? (
          <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("knowledgeFormsLoading")}
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("knowledgeNoForms")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-300">
                <tr>
                  <th className="px-5 py-4">{t("knowledgeForm")}</th>
                  <th className="px-5 py-4">{t("knowledgeSlug")}</th>
                  <th className="px-5 py-4">{t("knowledgeFormType")}</th>
                  <th className="px-5 py-4">{t("knowledgeStatus")}</th>
                  <th className="px-5 py-4">{t("knowledgeFields")}</th>
                  <th className="px-5 py-4 text-right">{t("knowledgeActions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                      {item.title_de}
                      {item.title_en ? (
                        <div className="mt-1 text-xs font-bold text-slate-400">
                          {item.title_en}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                      {item.slug}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                      {t(`knowledgeFormTypeValue_${item.type || "support"}`)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#007ab3]/10 px-3 py-1 text-xs font-black text-[#007ab3]">
                        {t(`knowledgeStatusValue_${item.status || "active"}`)}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                      {Array.isArray(item.fields_json) ? item.fields_json.length : 0}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                        >
                          {t("knowledgeEdit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                        >
                          {t("knowledgeDelete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}