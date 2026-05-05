import express from "express";

export default function brandUniquePagesRoutes({ pool, authMiddleware, wrap, isUuid, normalizeStatus }) {
  const router = express.Router();

  router.get(
    "/admin/brand-unique-pages/brands",
    authMiddleware,
    wrap(async (req, res) => {
     const { rows } = await pool.query(`
  SELECT
    id,
    name,
    slug,
    route,
    status,
    website_url as "websiteUrl",
    company_name as "companyName",
    company_phone as "companyPhone",
    company_email as "companyEmail",
    company_location as "companyLocation",
    support_email as "supportEmail",
    updated_at as "updatedAt"
  FROM brands
  ORDER BY updated_at DESC NULLS LAST, name ASC
`);
      res.json({ ok: true, data: rows });
    })
  );

  router.get(
    "/admin/brand-unique-pages/brands/:brandId/pages",
    authMiddleware,
    wrap(async (req, res) => {
      const { brandId } = req.params;
      if (!isUuid(brandId)) {
        return res.status(400).json({ ok: false, message: "Invalid brandId" });
      }

      const brandQ = await pool.query(
        `SELECT id, name, slug, route, status FROM brands WHERE id=$1 LIMIT 1`,
        [brandId]
      );

      if (!brandQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Brand not found" });
      }

     const brandQ = await pool.query(
  `
  SELECT
    id,
    name,
    slug,
    route,
    status,
    website_url as "websiteUrl",
    company_name as "companyName",
    company_phone as "companyPhone",
    company_email as "companyEmail",
    company_location as "companyLocation",
    support_email as "supportEmail"
  FROM brands
  WHERE id=$1
  LIMIT 1
  `,
  [brandId]
);

      res.json({ ok: true, data: { brand: brandQ.rows[0], pages: rows } });
    })
  );

  router.post(
    "/admin/brand-unique-pages/brands/:brandId/pages",
    authMiddleware,
    wrap(async (req, res) => {
      const { brandId } = req.params;
      const { slug, title, content, status } = req.body || {};

      if (!isUuid(brandId)) {
        return res.status(400).json({ ok: false, message: "Invalid brandId" });
      }

      const cleanSlug = String(slug || "").trim().toLowerCase();
      if (!cleanSlug) {
        return res.status(400).json({ ok: false, message: "slug is required" });
      }

      const pageTitle = title || cleanSlug.replace(/-/g, " ");
      const nextStatus = normalizeStatus(status) || "DRAFT";

      const pageQ = await pool.query(
        `
        INSERT INTO brand_unique_pages (brand_id, slug, title, status, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (brand_id, slug)
        DO UPDATE SET title = EXCLUDED.title, updated_at = NOW()
        RETURNING *
        `,
        [brandId, cleanSlug, pageTitle, nextStatus]
      );

      const page = pageQ.rows[0];

      const versionQ = await pool.query(
        `
        INSERT INTO brand_unique_page_versions (page_id, version, content, status, created_by)
        VALUES ($1, 1, $2, $3, $4)
        ON CONFLICT (page_id, version)
        DO NOTHING
        RETURNING *
        `,
        [
          page.id,
          content || { templateKey: "visual-builder", sections: [] },
          nextStatus,
          isUuid(req.user?.id) ? req.user.id : null,
        ]
      );

      res.json({ ok: true, data: { page, version: versionQ.rows[0] || null } });
    })
  );

  router.get(
    "/admin/brand-unique-pages/:pageId",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;
      if (!isUuid(pageId)) {
        return res.status(400).json({ ok: false, message: "Invalid pageId" });
      }

 const pageQ = await pool.query(
  `
  SELECT
    p.*,
    b.name as "brandName",
    b.slug as "brandSlug",
    b.website_url as "brandPreviewUrl"
  FROM brand_unique_pages p
  JOIN brands b ON b.id = p.brand_id
  WHERE p.id=$1
  LIMIT 1
  `,
  [pageId]
);
      if (!pageQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Page not found" });
      }

      const latestQ = await pool.query(
        `
        SELECT id, page_id, version, content, status, created_at, created_by
        FROM brand_unique_page_versions
        WHERE page_id=$1
        ORDER BY version DESC
        LIMIT 1
        `,
        [pageId]
      );

      res.json({
        ok: true,
        data: {
          page: pageQ.rows[0],
          latestVersion: latestQ.rows[0] || null,
        },
      });
    })
  );

  router.put(
    "/admin/brand-unique-pages/:pageId/content",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;
      const { content, status } = req.body || {};

      if (!isUuid(pageId)) {
        return res.status(400).json({ ok: false, message: "Invalid pageId" });
      }

      if (!content || typeof content !== "object") {
        return res.status(400).json({ ok: false, message: "content object is required" });
      }

      const pageQ = await pool.query(
        `SELECT id FROM brand_unique_pages WHERE id=$1 LIMIT 1`,
        [pageId]
      );

      if (!pageQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Page not found" });
      }

      const nextQ = await pool.query(
        `
        SELECT COALESCE(MAX(version), 0) + 1 as version
        FROM brand_unique_page_versions
        WHERE page_id=$1
        `,
        [pageId]
      );

      const version = Number(nextQ.rows[0].version);
      const nextStatus = normalizeStatus(status) || "DRAFT";

      const createdQ = await pool.query(
        `
        INSERT INTO brand_unique_page_versions (page_id, version, content, status, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [pageId, version, content, nextStatus, isUuid(req.user?.id) ? req.user.id : null]
      );

      await pool.query(
        `
        UPDATE brand_unique_pages
        SET status=$2, updated_at=NOW()
        WHERE id=$1
        `,
        [pageId, nextStatus]
      );

      res.json({ ok: true, data: createdQ.rows[0] });
    })
  );

  router.get(
    "/public/brands/:brandSlug/unique-pages/:pageSlug",
    wrap(async (req, res) => {
      const brandSlug = String(req.params.brandSlug || "").trim().toLowerCase();
      const pageSlug = String(req.params.pageSlug || "").trim().toLowerCase();

      const brandQ = await pool.query(
        `SELECT id, name, slug FROM brands WHERE LOWER(slug)=$1 LIMIT 1`,
        [brandSlug]
      );

      if (!brandQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Brand not found" });
      }

  const brandQ = await pool.query(
  `
  SELECT id, name, slug, route, status, website_url as "websiteUrl"
  FROM brands
  WHERE id=$1
  LIMIT 1
  `,
  [brandId]
);

      if (!pageQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Page not found" });
      }

      const versionQ = await pool.query(
        `
        SELECT id, version, content, status, created_at
        FROM brand_unique_page_versions
        WHERE page_id=$1 AND status='PUBLISHED'
        ORDER BY version DESC
        LIMIT 1
        `,
        [pageQ.rows[0].id]
      );

      res.json({
        ok: true,
        data: {
          brand: brandQ.rows[0],
          page: pageQ.rows[0],
          latestVersion: versionQ.rows[0] || null,
        },
      });
    })
  );

    router.get(
    "/public/brand-unique-pages/preview",
    wrap(async (req, res) => {
      const pageId = String(req.query.pageId || "").trim();
      const brandSlug = String(req.query.brandSlug || "").trim().toLowerCase();
      const pageSlug = String(req.query.pageSlug || "").trim().toLowerCase();

      let pageQ;

      if (pageId) {
        if (!isUuid(pageId)) {
          return res.status(400).json({ ok: false, message: "Invalid pageId" });
        }

        pageQ = await pool.query(
          `
          SELECT
            p.id,
            p.slug,
            p.title,
            p.status,
            b.id as "brandId",
            b.name as "brandName",
            b.slug as "brandSlug"
          FROM brand_unique_pages p
          JOIN brands b ON b.id = p.brand_id
          WHERE p.id=$1
          LIMIT 1
          `,
          [pageId]
        );
      } else {
        if (!brandSlug || !pageSlug) {
          return res.status(400).json({
            ok: false,
            message: "pageId or brandSlug/pageSlug is required",
          });
        }

        pageQ = await pool.query(
          `
          SELECT
            p.id,
            p.slug,
            p.title,
            p.status,
            b.id as "brandId",
            b.name as "brandName",
            b.slug as "brandSlug"
          FROM brand_unique_pages p
          JOIN brands b ON b.id = p.brand_id
          WHERE LOWER(b.slug)=$1 AND LOWER(p.slug)=$2
          LIMIT 1
          `,
          [brandSlug, pageSlug]
        );
      }

      if (!pageQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Page not found" });
      }

      const page = pageQ.rows[0];

      const versionQ = await pool.query(
        `
        SELECT id, page_id, version, content, status, created_at, created_by
        FROM brand_unique_page_versions
        WHERE page_id=$1
        ORDER BY version DESC
        LIMIT 1
        `,
        [page.id]
      );

      return res.json({
        ok: true,
        data: {
          page,
          content: versionQ.rows[0]?.content || { sections: [] },
          latestVersion: versionQ.rows[0] || null,
        },
      });
    })
  );

  return router;
}