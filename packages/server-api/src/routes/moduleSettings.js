import express from "express";

export default function moduleSettingsRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  function isAdmin(req) {
    return String(req.user?.role || "").toLowerCase() === "admin";
  }

  router.get(
    "/admin/module-permissions",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { rows } = await pool.query(`
        select
          b.id as brand_id,
          b.name as brand_name,
          b.slug as brand_slug,
          m.module_key,
          coalesce(p.can_view, false) as can_view,
          coalesce(p.can_create, false) as can_create,
          coalesce(p.can_edit, false) as can_edit,
          coalesce(p.can_delete, false) as can_delete,
          coalesce(p.show_on_website, true) as show_on_website,
          p.updated_at
        from brands b
        cross join (
          values
            ('overview'),
            ('brands'),
            ('support_chat'),
            ('blogs'),
            ('blog_categories'),
            ('blog_settings'),
            ('brand_unique_pages'),
            ('brand_inner_pages')
        ) as m(module_key)
        left join brand_module_permissions p
          on p.brand_id = b.id
          and p.module_key = m.module_key
        order by b.name asc, m.module_key asc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.put(
    "/admin/module-permissions/:brandId/:moduleKey",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { brandId, moduleKey } = req.params;
      const body = req.body || {};

      const { rows } = await pool.query(
        `
        insert into brand_module_permissions (
          brand_id,
          module_key,
          can_view,
          can_create,
          can_edit,
          can_delete,
          show_on_website,
          updated_at
        )
        values ($1,$2,$3,$4,$5,$6,$7,now())
        on conflict (brand_id, module_key)
        do update set
          can_view = excluded.can_view,
          can_create = excluded.can_create,
          can_edit = excluded.can_edit,
          can_delete = excluded.can_delete,
          show_on_website = excluded.show_on_website,
          updated_at = now()
        returning *
        `,
        [
          brandId,
          moduleKey,
          Boolean(body.can_view),
          Boolean(body.can_create),
          Boolean(body.can_edit),
          Boolean(body.can_delete),
          body.show_on_website !== false,
        ]
      );

      res.json({ ok: true, data: rows[0] });
    })
  );

  return router;
}