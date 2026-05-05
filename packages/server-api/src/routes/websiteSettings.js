import express from "express";

export default function websiteSettingsRoutes({ pool, authMiddleware, wrap, isUuid }) {
  const router = express.Router();

  function isAdmin(req) {
    return String(req.user?.role || "").toLowerCase() === "admin";
  }

  // ✅ ADMIN: GET settings
  router.get(
    "/admin/website-settings/:brandId",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isAdmin(req)) {
        return res.status(403).json({ ok: false });
      }

      const { brandId } = req.params;

      const inner = await pool.query(`
        select 
          p.id,
          p.title,
          'inner' as type,
          coalesce(w.is_visible, true) as is_visible
        from brand_inner_pages p
        left join brand_website_pages w
          on w.page_id = p.id
          and w.page_type = 'inner'
          and w.brand_id = $1
        where p.brand_id = $1
      `, [brandId]);

      const unique = await pool.query(`
        select 
          p.id,
          p.title,
          'unique' as type,
          coalesce(w.is_visible, true) as is_visible
        from brand_unique_pages p
        left join brand_website_pages w
          on w.page_id = p.id
          and w.page_type = 'unique'
          and w.brand_id = $1
        where p.brand_id = $1
      `, [brandId]);

      res.json({
        ok: true,
        inner: inner.rows,
        unique: unique.rows,
      });
    })
  );

  // ✅ ADMIN: UPDATE
  router.put(
    "/admin/website-settings/:brandId/:type/:pageId",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isAdmin(req)) {
        return res.status(403).json({ ok: false });
      }

      const { brandId, type, pageId } = req.params;
      const { is_visible } = req.body;

      const q = await pool.query(
        `
        insert into brand_website_pages (
          brand_id,
          page_type,
          page_id,
          is_visible,
          updated_at
        )
        values ($1,$2,$3,$4,now())
        on conflict (brand_id, page_type, page_id)
        do update set
          is_visible = excluded.is_visible,
          updated_at = now()
        returning *
        `,
        [brandId, type, pageId, Boolean(is_visible)]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  // ✅ PUBLIC (THIS IS YOUR QUESTION)
  router.get(
    "/public/:slug/website-settings",
    wrap(async (req, res) => {
      const { slug } = req.params;

      const q = await pool.query(`
        select page_type, page_id, is_visible
        from brand_website_pages w
        join brands b on b.id = w.brand_id
        where b.slug = $1
      `, [slug]);

      res.json({ ok: true, data: q.rows });
    })
  );

  return router;
}