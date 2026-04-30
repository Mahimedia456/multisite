import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const savedLang = localStorage.getItem("site_lang") || "de";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: "de",
    supportedLngs: ["de", "en"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      de: {
        translation: {
          overview: "Übersicht",
          brands: "Marken",
          brandInnerPages: "Marken-Innenseiten",
          brandUniquePages: "Einzigartige Markenseiten",
          supportChat: "Support-Chat",
          globalSearch: "Globale Suche",
          notifications: "Benachrichtigungen",
          needHelp: "Hilfe benötigt?",
          help: "Hilfe",
          logout: "Abmelden",
          holdingCo: "Holding Co.",
          globalAdmin: "Globaler Administrator",
        },
      },
      en: {
        translation: {
          overview: "Overview",
          brands: "Brands",
          brandInnerPages: "Brand Inner Pages",
          brandUniquePages: "Brand Unique Pages",
          supportChat: "Support Chat",
          globalSearch: "Global Search",
          notifications: "Notifications",
          needHelp: "Need Help?",
          help: "Help",
          logout: "Logout",
          holdingCo: "Holding Co.",
          globalAdmin: "Global Admin",
        },
      },
    },
  });

export default i18n;