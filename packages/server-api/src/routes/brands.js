import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/brands/:brandId
 * Brand variables + top templates (header/footer/home)
 */
router.get("/brands/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;

    const b = await pool.query(
      `
      SELECT
        id,
        name,
        slug,
        route,
        status,
        website_url,
        company_name,
        company_phone,
        company_whatsapp,
        company_email,
        company_location,
        support_email,
        accent_color,
        primary_color,
        primary_dark_color,
        accent_color_2,
        background_light,
        background_dark,
        surface_light,
        surface_dark,
        font_family,
        font_google_url,
        icon_font_url,
        logo_type,
        logo_value,
        logo_text,
        logo_url,
        typography_name,
        typography_desc,
        logo_file_name,
        logo_file_meta
      FROM brands
      WHERE id = $1
      LIMIT 1
      `,
      [brandId]
    );

    if (!b.rows[0]) {
      return res.status(404).json({ ok: false, message: "Brand not found" });
    }

    const brandRow = b.rows[0];

    const layout = await pool.query(
      `
      SELECT key, status, updated_at
      FROM brand_layout_templates
      WHERE brand_id = $1
        AND key IN ('header','footer')
      `,
      [brandId]
    );

    const home = await pool.query(
      `
      SELECT key, status, updated_at
      FROM templates
      WHERE brand_id = $1
        AND key = 'home'
      LIMIT 1
      `,
      [brandId]
    );

    const templates = [];
    const layoutMap = new Map(layout.rows.map((r) => [r.key, r]));
    const header = layoutMap.get("header");
    const footer = layoutMap.get("footer");
    const homeRow = home.rows[0];

    templates.push({
      id: "header",
      key: "header",
      title: "Global Header",
      status: header?.status || "draft",
      icon: "dock_to_bottom",
      edited: header?.updated_at ? new Date(header.updated_at).toLocaleString() : "—",
      updatedAt: header?.updated_at || null,
    });

    templates.push({
      id: "footer",
      key: "footer",
      title: "Global Footer",
      status: footer?.status || "draft",
      icon: "dock_to_bottom",
      edited: footer?.updated_at ? new Date(footer.updated_at).toLocaleString() : "—",
      updatedAt: footer?.updated_at || null,
    });

    templates.push({
      id: "home",
      key: "home",
      title: "Home Page",
      status: homeRow?.status || "draft",
      icon: "home",
      edited: homeRow?.updated_at ? new Date(homeRow.updated_at).toLocaleString() : "—",
      updatedAt: homeRow?.updated_at || null,
    });

    return res.json({
      ok: true,
      brand: {
        id: brandRow.id,
        name: brandRow.name,
        slug: brandRow.slug,
        route: brandRow.route,
        status: brandRow.status,
        websiteUrl: brandRow.website_url || "",

        accent: brandRow.accent_color || brandRow.primary_color || "#2563eb",
        logoType: brandRow.logo_type || "material",
        logoIcon: brandRow.logo_value || "pets",

        colors: {
          accent: brandRow.accent_color || brandRow.primary_color || "#2563eb",
          primary: brandRow.primary_color || brandRow.accent_color || "#2563eb",
          primaryDark: brandRow.primary_dark_color || "",
          accent2: brandRow.accent_color_2 || "",
          backgroundLight: brandRow.background_light || "",
          backgroundDark: brandRow.background_dark || "",
          surfaceLight: brandRow.surface_light || "",
          surfaceDark: brandRow.surface_dark || "",
        },

        fonts: {
          family: brandRow.font_family || brandRow.typography_name || "Inter",
          googleUrl: brandRow.font_google_url || "",
          iconsUrl: brandRow.icon_font_url || "",
        },

        typography: {
          name: brandRow.typography_name || brandRow.font_family || "Inter",
          desc: brandRow.typography_desc || "",
        },

        logo: {
          type: brandRow.logo_type || "material",
          value: brandRow.logo_value || "pets",
          text: brandRow.logo_text || brandRow.name || "",
          url: brandRow.logo_url || "",
        },

        company: {
          name: brandRow.company_name || brandRow.name || "",
          phone: brandRow.company_phone || "",
          whatsapp: brandRow.company_whatsapp || "",
          email: brandRow.company_email || "",
          location: brandRow.company_location || "",
          supportEmail: brandRow.support_email || "",
          websiteUrl: brandRow.website_url || "",
        },

        companyName: brandRow.company_name || brandRow.name || "",
        companyPhone: brandRow.company_phone || "",
        companyWhatsapp: brandRow.company_whatsapp || "",
        companyEmail: brandRow.company_email || "",
        companyLocation: brandRow.company_location || "",
        supportEmail: brandRow.support_email || "",

        logoFile: {
          name: brandRow.logo_file_name || "",
          meta: brandRow.logo_file_meta || "",
        },
      },
      templates,
    });
  } catch (e) {
    console.error("GET /api/brands/:brandId error:", e);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: e?.message,
      code: e?.code,
    });
  }
});

/**
 * GET /api/public/brands/:brandSlug/theme
 * Public brand theme for frontend websites
 */
router.get("/public/brands/:brandSlug/theme", async (req, res) => {
  try {
    const brandSlug = String(req.params.brandSlug || "").trim().toLowerCase();

    const { rows } = await pool.query(
      `
      SELECT
        id,
        name,
        slug,
        website_url,
        accent_color,
        primary_color,
        primary_dark_color,
        accent_color_2,
        background_light,
        background_dark,
        surface_light,
        surface_dark,
        font_family,
        font_google_url,
        icon_font_url,
        logo_type,
        logo_value,
        logo_text,
        company_name,
        company_phone,
        company_whatsapp,
        company_email,
        company_location,
        support_email
      FROM brands
      WHERE LOWER(slug) = $1
      LIMIT 1
      `,
      [brandSlug]
    );

    if (!rows[0]) {
      return res.status(404).json({ ok: false, message: "Brand not found" });
    }

    const b = rows[0];

    return res.json({
      ok: true,
      data: {
        brand: {
          id: b.id,
          name: b.name,
          slug: b.slug,
          websiteUrl: b.website_url || "",

          accentColor: b.accent_color || "",
          primaryColor: b.primary_color || b.accent_color || "",
          primaryDarkColor: b.primary_dark_color || "",
          accentColor2: b.accent_color_2 || "",
          backgroundLight: b.background_light || "",
          backgroundDark: b.background_dark || "",
          surfaceLight: b.surface_light || "",
          surfaceDark: b.surface_dark || "",

          fontFamily: b.font_family || "",
          fontGoogleUrl: b.font_google_url || "",
          iconFontUrl: b.icon_font_url || "",

          logoType: b.logo_type || "material",
          logoValue: b.logo_value || "",
          logoText: b.logo_text || b.name || "",

          company: {
            name: b.company_name || b.name || "",
            phone: b.company_phone || "",
            whatsapp: b.company_whatsapp || "",
            email: b.company_email || "",
            location: b.company_location || "",
            supportEmail: b.support_email || "",
          },
        },
      },
    });
  } catch (e) {
    console.error("GET /api/public/brands/:brandSlug/theme error:", e);
    res.status(500).json({
      ok: false,
      message: "Server error",
      error: e?.message,
      code: e?.code,
    });
  }
});

export default router;