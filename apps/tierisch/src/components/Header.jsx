import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : "")
).replace(/\/+$/, "");

const DEBUG_HEADER = true;

function getPath(obj, path) {
  return String(path || "")
    .split(".")
    .reduce((acc, key) => {
      if (!acc || typeof acc !== "object") return undefined;
      return acc[key];
    }, obj);
}

function firstValue(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
}

function normalizeThemeData(json) {
  const data = json?.data || {};

  return {
    raw: data,

    // common possible objects
    brand: data.brand || data.agency || data.data || {},
    theme: data.theme || data.layout || {},
    company: data.company || data.brand?.company || data.agency?.company || {},
  };
}

function pickBrandCompanyData(themePayload, header) {
  const raw = themePayload?.raw || {};
  const brand = themePayload?.brand || {};
  const theme = themePayload?.theme || {};
  const company = themePayload?.company || {};

  const headerCompany = header?.company || {};

  const email = firstValue(
    raw.company_email,
    raw.companyEmail,
    raw.email,
    getPath(raw, "company.email"),

    brand.company_email,
    brand.companyEmail,
    brand.email,
    getPath(brand, "company.email"),

    theme.company_email,
    theme.companyEmail,
    theme.email,
    getPath(theme, "company.email"),

    company.email,

    header.company_email,
    header.companyEmail,
    header.email,
    headerCompany.email
  );

  const phone = firstValue(
    raw.company_phone,
    raw.companyPhone,
    raw.phone,
    raw.telephone,
    raw.tel,
    getPath(raw, "company.phone"),

    brand.company_phone,
    brand.companyPhone,
    brand.phone,
    brand.telephone,
    brand.tel,
    getPath(brand, "company.phone"),

    theme.company_phone,
    theme.companyPhone,
    theme.phone,
    theme.telephone,
    theme.tel,
    getPath(theme, "company.phone"),

    company.phone,
    company.telephone,
    company.tel,

    header.company_phone,
    header.companyPhone,
    header.phone,
    header.telephone,
    header.tel,
    headerCompany.phone,
    headerCompany.telephone,
    headerCompany.tel
  );

  const whatsapp = firstValue(
    raw.company_whatsapp,
    raw.companyWhatsapp,
    raw.whatsapp,
    getPath(raw, "company.whatsapp"),

    brand.company_whatsapp,
    brand.companyWhatsapp,
    brand.whatsapp,
    getPath(brand, "company.whatsapp"),

    theme.company_whatsapp,
    theme.companyWhatsapp,
    theme.whatsapp,
    getPath(theme, "company.whatsapp"),

    company.whatsapp,

    header.company_whatsapp,
    header.companyWhatsapp,
    header.whatsapp,
    headerCompany.whatsapp
  );

  const location = firstValue(
    raw.company_location,
    raw.companyLocation,
    raw.location,
    raw.address,
    getPath(raw, "company.location"),
    getPath(raw, "company.address"),

    brand.company_location,
    brand.companyLocation,
    brand.location,
    brand.address,
    getPath(brand, "company.location"),
    getPath(brand, "company.address"),

    theme.company_location,
    theme.companyLocation,
    theme.location,
    theme.address,
    getPath(theme, "company.location"),
    getPath(theme, "company.address"),

    company.location,
    company.address,

    header.company_location,
    header.companyLocation,
    header.location,
    header.address,
    headerCompany.location,
    headerCompany.address
  );

  return {
    email,
    phone,
    whatsapp,
    location,
    company: {
      ...(headerCompany || {}),
      ...(company || {}),
      email,
      phone,
      whatsapp,
      location,
    },
  };
}

export default function Header({ brandSlug = "allianz4" }) {
  const { header, loading } = useBrandLayout(brandSlug);
  const {
    items,
    loading: settingsLoading,
    isHidden,
  } = useWebsiteSettings(brandSlug);

  const [themePayload, setThemePayload] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBrandTheme() {
      try {
        const url = `${API_BASE}/public/brands/${encodeURIComponent(
          brandSlug
        )}/theme?t=${Date.now()}`;

        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json().catch(() => null);

        if (DEBUG_HEADER) {
          console.log("[Header theme URL]", url);
          console.log("[Header theme status]", res.status, res.ok);
          console.log("[Header theme json]", json);
          console.log("[Header theme data]", json?.data);
        }

        if (!cancelled && res.ok && json?.ok) {
          setThemePayload(normalizeThemeData(json));
        } else if (!cancelled) {
          setThemePayload(null);
        }
      } catch (error) {
        if (DEBUG_HEADER) {
          console.error("[Header theme error]", error);
        }

        if (!cancelled) setThemePayload(null);
      }
    }

    loadBrandTheme();

    return () => {
      cancelled = true;
    };
  }, [brandSlug]);

  const hiddenWebsitePages = useMemo(() => {
    return (items || [])
      .filter((x) => x.is_visible === false && x.slug)
      .map((x) => `${x.page_type}:${x.slug}`);
  }, [items]);

  if (loading || settingsLoading) return null;
  if (!header) return null;

  const companyData = pickBrandCompanyData(themePayload, header);

  const mergedHeader = {
    ...header,
    ...(themePayload?.raw || {}),
    ...(themePayload?.brand || {}),
    ...(themePayload?.theme || {}),

    company: companyData.company,

    company_email: companyData.email,
    companyEmail: companyData.email,
    email: companyData.email,

    company_phone: companyData.phone,
    companyPhone: companyData.phone,
    phone: companyData.phone,

    company_whatsapp: companyData.whatsapp,
    companyWhatsapp: companyData.whatsapp,
    whatsapp: companyData.whatsapp,

    company_location: companyData.location,
    companyLocation: companyData.location,
    location: companyData.location,

    cta: {
      label: "contact",
      to: "/contact",
      href: "",
    },
  };

  if (DEBUG_HEADER) {
    console.log("[Header final merged contact]", {
      brandSlug,
      themePayload,
      company: mergedHeader.company,
      email: mergedHeader.email,
      phone: mergedHeader.phone,
      whatsapp: mergedHeader.whatsapp,
      location: mergedHeader.location,
      cta: mergedHeader.cta,
    });
  }

  return (
    <SiteHeader
      brand={mergedHeader}
      hiddenWebsitePages={hiddenWebsitePages}
      showDefaultAbout={!isHidden("unique", "about")}
      contactPlacement="topbar"
      showTopBar={true}
    />
  );
}