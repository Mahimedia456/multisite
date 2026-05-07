import { useEffect, useState } from "react";
import { SiteHeader } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";
import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : "")
).replace(/\/+$/, "");

function pickBrandCompanyData(brandData, header) {
  const companyFromBrand = brandData?.company || {};
  const companyFromHeader = header?.company || {};

  const email =
    brandData?.company_email ||
    brandData?.companyEmail ||
    brandData?.email ||
    companyFromBrand?.email ||
    header?.company_email ||
    header?.companyEmail ||
    header?.email ||
    companyFromHeader?.email ||
    "";

  const phone =
    brandData?.company_phone ||
    brandData?.companyPhone ||
    brandData?.phone ||
    companyFromBrand?.phone ||
    header?.company_phone ||
    header?.companyPhone ||
    header?.phone ||
    companyFromHeader?.phone ||
    "";

  const whatsapp =
    brandData?.company_whatsapp ||
    brandData?.companyWhatsapp ||
    brandData?.whatsapp ||
    companyFromBrand?.whatsapp ||
    header?.company_whatsapp ||
    header?.companyWhatsapp ||
    header?.whatsapp ||
    companyFromHeader?.whatsapp ||
    "";

  const location =
    brandData?.company_location ||
    brandData?.companyLocation ||
    brandData?.location ||
    brandData?.address ||
    companyFromBrand?.location ||
    companyFromBrand?.address ||
    header?.company_location ||
    header?.companyLocation ||
    header?.location ||
    header?.address ||
    companyFromHeader?.location ||
    companyFromHeader?.address ||
    "";

  return {
    email,
    phone,
    whatsapp,
    location,
    company: {
      ...(companyFromHeader || {}),
      ...(companyFromBrand || {}),
      email,
      phone,
      whatsapp,
      location,
    },
  };
}

export default function Header({ brandSlug = "kundler3" }) {
  const { header, loading } = useBrandLayout(brandSlug);
  const {
    items,
    loading: settingsLoading,
    isHidden,
  } = useWebsiteSettings(brandSlug);

  const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBrand() {
      try {
        const res = await fetch(
          `${API_BASE}/public/brands/${encodeURIComponent(
            brandSlug
          )}/theme?t=${Date.now()}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);

        if (!cancelled && res.ok && json?.ok) {
          setBrandData(json.data || null);
        }
      } catch {
        if (!cancelled) setBrandData(null);
      }
    }

    loadBrand();

    return () => {
      cancelled = true;
    };
  }, [brandSlug]);

  if (loading || settingsLoading) return null;
  if (!header) return null;

  const hiddenWebsitePages = (items || [])
    .filter((x) => x.is_visible === false && x.slug)
    .map((x) => `${x.page_type}:${x.slug}`);

  const companyData = pickBrandCompanyData(brandData, header);

  const mergedHeader = {
    ...header,
    ...(brandData || {}),

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
      ...(header?.cta || {}),
      ...(brandData?.cta || {}),
      label: brandData?.cta?.label || header?.cta?.label || "kontakt",
      to: brandData?.cta?.to || header?.cta?.to || "/contact",
    },
  };

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