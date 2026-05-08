import express from "express";

export default function publicBrandRoutes({ pool, wrap }) {
  const router = express.Router();

  router.get(
    "/public/brands/:slug/layout",
    wrap(async (req, res) => {
      const slug = String(req.params.slug || "").trim().toLowerCase();

      if (!slug) {
        return res.status(400).json({
          ok: false,
          message: "slug is required",
        });
      }

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");
      res.setHeader("CDN-Cache-Control", "no-store");
      res.setHeader("Vercel-CDN-Cache-Control", "no-store");

      const bq = await pool.query(
        `
        SELECT id, name, slug, route
        FROM brands
        WHERE LOWER(slug) = $1
        LIMIT 1
        `,
        [slug]
      );

      if (!bq.rows.length) {
        return res.status(404).json({
          ok: false,
          message: "Brand not found",
        });
      }

      const brand = bq.rows[0];

      const layoutsQ = await pool.query(
        `
        SELECT
          t.key,
          t.id as template_id,
          v.id as version_id,
          v.version,
          v.created_at,
          v.content
        FROM brand_layout_templates t
        LEFT JOIN LATERAL (
          SELECT id, version, created_at, content
          FROM brand_layout_template_versions
          WHERE template_id = t.id
          ORDER BY created_at DESC, version DESC
          LIMIT 1
        ) v ON true
        WHERE t.brand_id = $1
          AND t.key IN ('header','footer')
        ORDER BY t.key ASC
        `,
        [brand.id]
      );

      const headerRow = layoutsQ.rows.find((r) => r.key === "header") || null;
      const footerRow = layoutsQ.rows.find((r) => r.key === "footer") || null;

      return res.json({
        ok: true,
        data: {
          brand,
          header: headerRow?.content || null,
          footer: footerRow?.content || null,
          debug: {
            headerTemplateId: headerRow?.template_id || null,
            headerVersion: headerRow?.version || null,
            headerCreatedAt: headerRow?.created_at || null,
            footerTemplateId: footerRow?.template_id || null,
            footerVersion: footerRow?.version || null,
            footerCreatedAt: footerRow?.created_at || null,
          },
        },
      });
    })
  );

  router.get(
    "/public/shared-pages/:slug",
    wrap(async (req, res) => {
      const slug = String(req.params.slug || "").trim().toLowerCase();

      if (!slug) {
        return res.status(400).json({
          ok: false,
          message: "slug is required",
        });
      }

      const pageQ = await pool.query(
        `
        SELECT id, slug, title, status, updated_at
        FROM brand_shared_pages
        WHERE LOWER(slug) = $1
        LIMIT 1
        `,
        [slug]
      );

      if (!pageQ.rows.length) {
        return res.status(404).json({
          ok: false,
          message: "Page not found",
        });
      }

      const page = pageQ.rows[0];

      const latestQ = await pool.query(
        `
        SELECT id, version, content, created_at
        FROM brand_shared_page_versions
        WHERE page_id = $1
        ORDER BY version DESC
        LIMIT 1
        `,
        [page.id]
      );

      const latest = latestQ.rows[0] || null;

      res.json({
        ok: true,
        data: {
          page: {
            id: page.id,
            slug: page.slug,
            title: page.title,
            status: page.status,
            updatedAt: page.updated_at,
          },
          latestVersion: latest
            ? {
                id: latest.id,
                version: latest.version,
                content: latest.content,
                createdAt: latest.created_at,
              }
            : null,
        },
      });
    })
  );

  return router;
}