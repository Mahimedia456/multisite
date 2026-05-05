import express from "express";

export default function adminSettingsRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  function isFullAdmin(req) {
    return String(req.user?.role || "").toLowerCase() === "admin";
  }

  // ✅ GET all admin permissions
  router.get(
    "/admin/admin-settings",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const adminsQ = await pool.query(`
        select id, email, role
        from admins
        order by email asc
      `);

      const permissionsQ = await pool.query(`
        select *
        from admin_module_permissions
        order by email asc, module_key asc
      `);

      res.json({
        ok: true,
        admins: adminsQ.rows,
        permissions: permissionsQ.rows,
      });
    })
  );

  // ✅ PUT update permission
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
          email.toLowerCase(),
          moduleKey,
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