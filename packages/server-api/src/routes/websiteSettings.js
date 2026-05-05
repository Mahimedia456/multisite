import express from "express";

export default function websiteSettingsRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  function isAdmin(req) {
    return String(req.user?.role || "").toLowerCase() === "admin";
  }

  router.get(
    "/admin/website-settings/:brandId",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { brandId } = req.params;

      const sharedQ = await pool.query(
        `
        select
          p.id,
          p.slug,
          p.title,
          p.status,
          'shared' as type,
          coalesce(w.is_visible, true) as is_visible
        from brand_shared_pages p
        left join brand_website_pages w
          on w.brand_id = $1
          and w.page_type = 'shared'
          and w.page_id = p.id
        order by p.title asc nulls last, p.slug asc
        `,
        [brandId]
      );

      const uniqueQ = await pool.query(
        `
        select
          p.id,
          p.slug,
          p.title,
          p.status,
          'unique' as type,
          coalesce(w.is_visible, true) as is_visible
        from brand_unique_pages p
        left join brand_website_pages w
          on w.brand_id = $1
          and w.page_type = 'unique'
          and w.page_id = p.id
        where p.brand_id = $1
        order by p.title asc nulls last, p.slug asc
        `,
        [brandId]
      );

      return res.json({
        ok: true,
        shared: sharedQ.rows,
        inner: [],
        unique: uniqueQ.rows,
      });
    })
  );

  router.put(
    "/admin/website-settings/:brandId/:type/:pageId",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { brandId, type, pageId } = req.params;
      const body = req.body || {};

      if (!["shared", "unique"].includes(type)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid page type",
        });
      }

      const { rows } = await pool.query(
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
        [brandId, type, pageId, body.is_visible !== false]
      );

      return res.json({ ok: true, data: rows[0] });
    })
  );

  router.get(
    "/public/:slug/website-settings",
    wrap(async (req, res) => {
      const slug = String(req.params.slug || "").trim().toLowerCase();

      const { rows } = await pool.query(
        `
        select
          w.page_type,
          w.page_id,
          w.is_visible
        from brand_website_pages w
        join brands b on b.id = w.brand_id
        where lower(b.slug) = $1
        `,
        [slug]
      );

      return res.json({ ok: true, data: rows });
    })
  );

  return router;
}