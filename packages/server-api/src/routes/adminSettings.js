import express from "express";

const ADMIN_MODULE_KEYS = [
  "overview",
  "brands",
  "main_website",
  "generate_brand",
  "support_chat",
  "blogs",
  "blog_categories",
  "settings",
  "blog_settings",
  "module_settings",
  "website_settings",
  "admin_settings",
  "brand_unique_pages",
  "brand_inner_pages",
  "knowledge_area",
  "knowledge_categories",
  "knowledge_articles",
  "knowledge_faqs",
  "knowledge_forms",
  "knowledge_submissions",
];

export default function adminSettingsRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  function isFullAdmin(req) {
    return String(req.user?.role || "").toLowerCase() === "admin";
  }

  router.get(
    "/admin/admin-settings",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const adminsQ = await pool.query(`
        select id, email, role, created_at
        from admins
        where lower(coalesce(role,'')) = 'admin'
        order by email asc
      `);

      const permissionsQ = await pool.query(
        `
        select
          a.email,
          m.module_key,
          coalesce(p.can_view, false) as can_view,
          coalesce(p.can_create, false) as can_create,
          coalesce(p.can_edit, false) as can_edit,
          coalesce(p.can_delete, false) as can_delete,
          p.updated_at
        from (
          select lower(email) as email
          from admins
          where lower(coalesce(role,'')) = 'admin'
        ) a
        cross join unnest($1::text[]) as m(module_key)
        left join admin_module_permissions p
          on lower(p.email) = a.email
          and p.module_key = m.module_key
        order by a.email asc, m.module_key asc
        `,
        [ADMIN_MODULE_KEYS]
      );

      res.json({
        ok: true,
        admins: adminsQ.rows,
        permissions: permissionsQ.rows,
        module_keys: ADMIN_MODULE_KEYS,
      });
    })
  );

  router.put(
    "/admin/admin-settings/:email/:moduleKey",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { email, moduleKey } = req.params;
      const body = req.body || {};

      const q = await pool.query(
        `
        insert into admin_module_permissions (
          email,
          module_key,
          can_view,
          can_create,
          can_edit,
          can_delete,
          updated_at
        )
        values ($1,$2,$3,$4,$5,$6,now())
        on conflict (email, module_key)
        do update set
          can_view = excluded.can_view,
          can_create = excluded.can_create,
          can_edit = excluded.can_edit,
          can_delete = excluded.can_delete,
          updated_at = now()
        returning *
        `,
        [
          String(email).toLowerCase(),
          String(moduleKey).trim(),
          Boolean(body.can_view),
          Boolean(body.can_create),
          Boolean(body.can_edit),
          Boolean(body.can_delete),
        ]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  return router;
}