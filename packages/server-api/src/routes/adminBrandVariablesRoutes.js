import express from "express";
import { getActorFromReq, logActivity } from "../utils/activityLogger.js";

export default function adminBrandVariablesRoutes({
  pool,
  authMiddleware,
  wrap,
  isUuid,
}) {
  const router = express.Router();

  router.get(
    "/admin/brands/:brandId/detail",
    authMiddleware,
    wrap(async (req, res) => {
      const { brandId } = req.params;

      if (!isUuid(brandId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid brandId",
        });
      }

      const brandDetailQ = await pool.query(
        `
        SELECT
          id, name, route, status, updated_at,
          accent_color, primary_color, logo_type, logo_value,
          typography_json, nav_links_json, cta_json, brand_description,
          company_name, company_phone, company_whatsapp, company_email, company_location
        FROM brands
        WHERE id = $1
        LIMIT 1
        `,
        [brandId]
      );

      if (!brandDetailQ.rows.length) {
        return res.status(404).json({
          ok: false,
          message: "Brand not found",
        });
      }

      const b = brandDetailQ.rows[0];
      const accent = b.accent_color || b.primary_color || "#2ec2b3";
      const typography = b.typography_json || {};

      const layoutsQ = await pool.query(
        `
        SELECT
          t.id,
          t.brand_id,
          t.key,
          t.title,
          t.status,
          t.updated_at,
          v.id as version_id,
          v.version,
          v.created_at,
          v.content
        FROM brand_layout_templates t
        LEFT JOIN LATERAL (
          SELECT id, version, created_at, content
          FROM brand_layout_template_versions
          WHERE template_id = t.id
          ORDER BY version DESC
          LIMIT 1
        ) v ON true
        WHERE t.brand_id = $1
          AND t.key IN ('header','footer')
        ORDER BY t.key ASC
        `,
        [brandId]
      );

      const templates = layoutsQ.rows.map((r) => ({
        id: r.id,
        brandId: r.brand_id,
        key: r.key,
        title: r.title,
        status: r.status,
        updatedAt: r.updated_at,
        latestVersion: r.version_id
          ? {
              id: r.version_id,
              version: r.version,
              content: r.content,
              createdAt: r.created_at,
            }
          : null,
      }));

      res.json({
        ok: true,
        data: {
          brand: {
            id: b.id,
            name: b.name,
            route: b.route,
            status: b.status,
            updatedAt: b.updated_at,
            colors: {
              primary: accent,
              accent,
              primaryDark: null,
              accent2: null,
            },
            fonts: {
              family: typography.family || typography.fontFamily || null,
              googleUrl:
                typography.googleUrl || typography.google_font_url || null,
              iconsUrl: typography.iconsUrl || typography.icon_font_url || null,
            },
            logo: {
              type: b.logo_type || null,
              value: b.logo_value || null,
              text: b.name || "",
            },
            navLinks: b.nav_links_json || [],
            cta: b.cta_json || null,
            description: b.brand_description || "",
            company: {
              name: b.company_name || "",
              phone: b.company_phone || "",
              whatsapp: b.company_whatsapp || "",
              email: b.company_email || "",
              location: b.company_location || "",
            },
          },
          templates,
        },
      });
    })
  );

  router.put(
    "/admin/brands/:brandId/variables",
    authMiddleware,
    wrap(async (req, res) => {
      const { brandId } = req.params;

      if (!isUuid(brandId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid brandId",
        });
      }

      const {
        accentColor,
        primaryColor,
        primaryDarkColor,
        accentColor2,
        backgroundLight,
        backgroundDark,
        surfaceLight,
        surfaceDark,
        logoType,
        logoValue,
        typography,
        companyName,
        companyPhone,
        companyWhatsapp,
        companyEmail,
        companyLocation,
        websiteUrl,
      } = req.body || {};

      const typographyPayload =
        typography && typeof typography === "object" ? typography : null;

      const oldBrandQ = await pool.query(
        `
        SELECT
          id,
          name,
          slug,
          company_name,
          company_phone,
          company_whatsapp,
          company_email,
          company_location,
          website_url,
          accent_color,
          primary_color,
          logo_type,
          logo_value
        FROM brands
        WHERE id = $1
        LIMIT 1
        `,
        [brandId]
      );

      const oldBrand = oldBrandQ.rows[0] || null;

      const upd = await pool.query(
        `
        UPDATE brands
        SET
          accent_color = COALESCE($2, accent_color),
          primary_color = COALESCE($3, primary_color),
          primary_dark_color = COALESCE($4, primary_dark_color),
          accent_color_2 = COALESCE($5, accent_color_2),
          background_light = COALESCE($6, background_light),
          background_dark = COALESCE($7, background_dark),
          surface_light = COALESCE($8, surface_light),
          surface_dark = COALESCE($9, surface_dark),

          font_family = COALESCE($10, font_family),
          font_google_url = COALESCE($11, font_google_url),
          icon_font_url = COALESCE($12, icon_font_url),
          typography_json = COALESCE($13, typography_json),

          logo_type = COALESCE($14, logo_type),
          logo_value = COALESCE($15, logo_value),

          company_name = COALESCE($16, company_name),
          company_phone = COALESCE($17, company_phone),
          company_whatsapp = COALESCE($18, company_whatsapp),
          company_email = COALESCE($19, company_email),
          company_location = COALESCE($20, company_location),
          website_url = COALESCE($21, website_url),

          updated_at = NOW()
        WHERE id = $1
        RETURNING
          id,
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
          typography_json,
          logo_type,
          logo_value,
          company_name,
          company_phone,
          company_whatsapp,
          company_email,
          company_location,
          website_url,
          updated_at
        `,
        [
          brandId,
          accentColor ?? null,
          primaryColor ?? null,
          primaryDarkColor ?? null,
          accentColor2 ?? null,
          backgroundLight ?? null,
          backgroundDark ?? null,
          surfaceLight ?? null,
          surfaceDark ?? null,

          typographyPayload?.family ?? null,
          typographyPayload?.googleUrl ?? null,
          typographyPayload?.iconsUrl ?? null,
          typographyPayload ?? null,

          logoType ?? null,
          logoValue ?? null,

          companyName ?? null,
          companyPhone ?? null,
          companyWhatsapp ?? null,
          companyEmail ?? null,
          companyLocation ?? null,
          websiteUrl ?? null,
        ]
      );

      if (!upd.rows.length) {
        return res.status(404).json({
          ok: false,
          message: "Brand not found",
        });
      }

      const r = upd.rows[0];
      const actor = getActorFromReq(req);

      await logActivity(pool, {
        brandId: r.id,
        brandSlug: oldBrand?.slug || null,
        brandName: oldBrand?.name || null,

        ...actor,

        moduleKey: "brands",
        moduleLabel: "Brands",
        action: "updated",
        title: `${oldBrand?.name || "Agency"} company details updated`,
        description: `${
          actor.actorEmail || "Admin"
        } updated company details, contact information, colors or logo settings.`,

        entityType: "brand",
        entityId: r.id,
        entitySlug: oldBrand?.slug || null,

        oldData: oldBrand || {},
        newData: {
          accent_color: r.accent_color,
          primary_color: r.primary_color,
          logo_type: r.logo_type,
          logo_value: r.logo_value,
          company_name: r.company_name,
          company_phone: r.company_phone,
          company_whatsapp: r.company_whatsapp,
          company_email: r.company_email,
          company_location: r.company_location,
          website_url: r.website_url,
        },
        meta: {
          path: `/brands/${r.id}`,
          route: "/admin/brands/:brandId/variables",
        },
        notifyEmail: true,
      });

      return res.json({
        ok: true,
        data: {
          brandId: r.id,

          accentColor: r.accent_color,
          primaryColor: r.primary_color,
          primaryDarkColor: r.primary_dark_color,
          accentColor2: r.accent_color_2,
          backgroundLight: r.background_light,
          backgroundDark: r.background_dark,
          surfaceLight: r.surface_light,
          surfaceDark: r.surface_dark,

          logoType: r.logo_type,
          logoValue: r.logo_value,

          typography: {
            family: r.font_family || r.typography_json?.family || "",
            googleUrl: r.font_google_url || r.typography_json?.googleUrl || "",
            iconsUrl: r.icon_font_url || r.typography_json?.iconsUrl || "",
          },

          company: {
            name: r.company_name,
            phone: r.company_phone,
            whatsapp: r.company_whatsapp,
            email: r.company_email,
            location: r.company_location,
            websiteUrl: r.website_url,
          },

          websiteUrl: r.website_url,
          updatedAt: r.updated_at,
        },
      });
    })
  );

  return router;
}