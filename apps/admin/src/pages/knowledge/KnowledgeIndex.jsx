import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";

const KNOWLEDGE_ITEMS = [
  {
    titleKey: "knowledgeCategories",
    descriptionKey: "knowledgeCategoriesDesc",
    icon: "category",
    path: "/knowledge/categories",
  },
  {
    titleKey: "knowledgeArticles",
    descriptionKey: "knowledgeArticlesDesc",
    icon: "article",
    path: "/knowledge/articles",
  },
  {
    titleKey: "knowledgeFaqs",
    descriptionKey: "knowledgeFaqsDesc",
    icon: "help",
    path: "/knowledge/faqs",
  },
  {
    titleKey: "knowledgeForms",
    descriptionKey: "knowledgeFormsDesc",
    icon: "dynamic_form",
    path: "/knowledge/forms",
  },
  {
    titleKey: "knowledgeSubmissions",
    descriptionKey: "knowledgeSubmissionsDesc",
    icon: "inbox",
    path: "/knowledge/submissions",
  },
  {
    titleKey: "knowledgeSettings",
    descriptionKey: "knowledgeSettingsDesc",
    icon: "settings",
    path: "/knowledge/settings",
  },
];

export default function KnowledgeIndex() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
            {t("knowledgeArea")}
          </div>

          <h1 className="text-2xl font-black text-slate-950 dark:text-white">
            {t("knowledgeArea")}
          </h1>

          <p className="max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
            {t("knowledgeAreaSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {KNOWLEDGE_ITEMS.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className="group rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#007ab3]/30 hover:shadow-xl hover:shadow-[#007ab3]/10 dark:border-white/10 dark:bg-slate-900 dark:hover:border-[#007ab3]/40"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3] transition group-hover:bg-[#007ab3] group-hover:text-white">
              <MIcon name={item.icon} className="text-3xl" />
            </div>

            <h2 className="text-lg font-black text-slate-950 dark:text-white">
              {t(item.titleKey)}
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t(item.descriptionKey)}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-black text-[#007ab3]">
              <span>{t("knowledgeOpen")}</span>
              <MIcon
                name="arrow_forward"
                className="text-xl transition group-hover:translate-x-1"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}