import crypto from "crypto";
import { db } from "../db.js";

function slugify(v) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeJson(v, fallback) {
  try {
    if (!v) return fallback;
    if (typeof v === "object") return v;
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

// ✅ mock reference image storage (replace later with S3/Cloudinary)
function mockStoreReferenceImage(file) {
  if (!file) return null;
  const hash = crypto.createHash("sha1").update(file.buffer).digest("hex");
  return `ref://image/${hash}-${file.originalname}`;
}

export async function generateBrandAllInOne(req, res) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const templateSlug = String(req.body.template_slug || "kundler3").toLowerCase();
    const templateVersion = Number(req.body.template_version || 22);

    // 1) template brand
    const tplBrandQ = await client.query(
      `SELECT * FROM brands WHERE slug=$1 LIMIT 1`,
      [templateSlug]
    );
    const tplBrand = tplBrandQ.rows[0];
    if (!tplBrand) {
      await client.query("ROLLBACK");
      return res.status(404).json({ ok: false, message: "Template brand not found" });
    }

    // 2) template layout (brand_layouts table assumed)
    // If you store version in layout, filter by version. Otherwise we use brand.template_version.
    const tplLayoutQ = await client.query(
      `SELECT * FROM brand_layouts WHERE brand_id=$1 LIMIT 1`,
      [tplBrand.id]
    );
    const tplLayout = tplLayoutQ.rows[0] || null;

    // 3) build brand payload from request + template fallback
    const name = req.body.name || "New Brand";
    const slug = slugify(req.body.slug || name);
    if (!slug) {
      await client.query("ROLLBACK");
      return res.status(400).json({ ok: false, message: "Slug required" });
    }

    const exists = await client.query(`SELECT id FROM brands WHERE slug=$1 LIMIT 1`, [slug]);
    if (exists.rows.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ ok: false, message: "Slug already exists" });
    }

    const route = req.body.route || `/${slug}`;

    const referenceImageUrl = mockStoreReferenceImage(req.file);

    // ✅ logo_url from form OR from template OR null
    const logoUrl = req.body.logo_url || tplBrand.logo_url || null;

    const payload = {
      slug,
      name,
      route,
      status: req.body.status || tplBrand.status || "active",
      template_version: templateVersion,

      brand_description: req.body.brand_description || tplBrand.brand_description || "",

      primary_color: req.body.primary_color || tplBrand.primary_color,
      primary_dark_color: req.body.primary_dark_color || tplBrand.primary_dark_color,
      accent_color: req.body.accent_color || tplBrand.accent_color,
      accent_color_2: req.body.accent_color_2 || tplBrand.accent_color_2,
      background_light: req.body.background_light || tplBrand.background_light,
      background_dark: req.body.background_dark || tplBrand.background_dark,
      surface_light: req.body.surface_light || tplBrand.surface_light,
      surface_dark: req.body.surface_dark || tplBrand.surface_dark,

      font_family: req.body.font_family || tplBrand.font_family,
      font_google_url: req.body.font_google_url || tplBrand.font_google_url,
      icon_font_url: req.body.icon_font_url || tplBrand.icon_font_url,

      logo_type: req.body.logo_type || tplBrand.logo_type,
      logo_value: req.body.logo_value || tplBrand.logo_value,
      logo_text: req.body.logo_text || name,
      logo_url: logoUrl,

      typography_json: req.body.typography_json || tplBrand.typography_json,
      nav_links_json: req.body.nav_links_json || tplBrand.nav_links_json,
      cta_json: req.body.cta_json || tplBrand.cta_json,

      company_name: req.body.company_name || "",
      company_phone: req.body.company_phone || "",
      company_whatsapp: req.body.company_whatsapp || "",
      company_email: req.body.company_email || "",
      company_location: req.body.company_location || "",

      reference_image_url: referenceImageUrl,
    };

    // 4) insert brand
    const insBrandQ = await client.query(
      `
      INSERT INTO brands (
        slug, name, route, status, template_version,
        brand_description,
        primary_color, primary_dark_color, accent_color, accent_color_2,
        background_light, background_dark, surface_light, surface_dark,
        font_family, font_google_url, icon_font_url,
        logo_type, logo_value, logo_text, logo_url,
        typography_json, nav_links_json, cta_json,
        company_name, company_phone, company_whatsapp, company_email, company_location,
        reference_image_url
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,
        $7,$8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,$17,
        $18,$19,$20,$21,
        $22,$23,$24,
        $25,$26,$27,$28,$29,
        $30
      )
      RETURNING *
      `,
      [
        payload.slug, payload.name, payload.route, payload.status, payload.template_version,
        payload.brand_description,
        payload.primary_color, payload.primary_dark_color, payload.accent_color, payload.accent_color_2,
        payload.background_light, payload.background_dark, payload.surface_light, payload.surface_dark,
        payload.font_family, payload.font_google_url, payload.icon_font_url,
        payload.logo_type, payload.logo_value, payload.logo_text, payload.logo_url,
        payload.typography_json, payload.nav_links_json, payload.cta_json,
        payload.company_name, payload.company_phone, payload.company_whatsapp, payload.company_email, payload.company_location,
        payload.reference_image_url
      ]
    );

    const createdBrand = insBrandQ.rows[0];

    // 5) clone layout from template (header/footer/pages)
    // If tplLayout is null -> create minimal layout using template brand json
    const headerBase =
      tplLayout?.header_json ||
      {
        logoType: tplBrand.logo_type,
        logoValue: tplBrand.logo_value,
        logoText: tplBrand.logo_text,
        brandName: tplBrand.name,
        navLinks: safeJson(tplBrand.nav_links_json, []),
        cta: safeJson(tplBrand.cta_json, null),
      };

    // ✅ inject NEW brand identity into header
    const headerFinal = {
      ...(typeof headerBase === "object" ? headerBase : {}),
      brandName: createdBrand.name,
      brandSlug: createdBrand.slug,
      logoText: createdBrand.logo_text,
      logoUrl: createdBrand.logo_url,
    };

    const footerFinal = tplLayout?.footer_json || {};
    const pagesFinal = tplLayout?.pages_json || [];

    const insLayoutQ = await client.query(
      `
      INSERT INTO brand_layouts (brand_id, header_json, footer_json, pages_json)
      VALUES ($1,$2::jsonb,$3::jsonb,$4::jsonb)
      RETURNING *
      `,
      [
        createdBrand.id,
        JSON.stringify(headerFinal),
        JSON.stringify(footerFinal),
        JSON.stringify(pagesFinal),
      ]
    );

    const createdLayout = insLayoutQ.rows[0];

    await client.query("COMMIT");

    return res.json({ ok: true, brand: createdBrand, layout: createdLayout });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return res.status(500).json({ ok: false, message: e?.message || "Server error" });
  } finally {
    client.release();
  }
}
