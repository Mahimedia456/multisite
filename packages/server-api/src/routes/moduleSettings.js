import express from "express";

export default function moduleSettingsRoutes({ pool, authMiddleware, wrap, isUuid }) {
  const router = express.Router();

  function isFullAdmin(req) {
    const role = String(req.user?.role || "").toLowerCase();
    return role === "admin";
  }

  /* =========================
     GET ALL MODULE SETTINGS
  ========================= */
  router.get(
    "/admin/module-permissions",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const q = await pool.query(`
        SELECT
          br.id AS brand_id,
          br.name AS brand_name,
          br.slug AS brand_slug,
          p.module_key,
          COALESCE(p.can_view,false) AS can_view,
          COALESCE(p.can_create,false) AS can_create,
          COALESCE(p.can_edit,false) AS can_edit,
          COALESCE(p.can_delete,false) AS can_delete,
          COALESCE(p.show_on_website,true) AS show_on_website
        FROM brands br
        LEFT JOIN brand_module_permissions p
          ON p.brand_id = br.id
        ORDER BY br.name ASC, p.module_key ASC
      `);

      res.json({ ok: true, data: q.rows });
    })
  );

  /* =========================
     UPDATE MODULE SETTINGS
  ========================= */
  router.put(
    "/admin/module-permissions/:brandId/:moduleKey",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { brandId, moduleKey } = req.params;

      if (!isUuid(brandId)) {
        return res.status(400).json({ ok: false, message: "Invalid brandId" });
      }

      const body = req.body || {};

      const q = await pool.query(
        `
        INSERT INTO brand_module_permissions (
          brand_id,
          module_key,
          can_view,
          can_create,
          can_edit,
          can_delete,
          show_on_website,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
        ON CONFLICT (brand_id, module_key)
        DO UPDATE SET
          can_view=EXCLUDED.can_view,
          can_create=EXCLUDED.can_create,
          can_edit=EXCLUDED.can_edit,
          can_delete=EXCLUDED.can_delete,
          show_on_website=EXCLUDED.show_on_website,
          updated_at=NOW()
        RETURNING *
        `,
        [
          brandId,
          moduleKey,
          Boolean(body.can_view),
          Boolean(body.can_create),
          Boolean(body.can_edit),
          Boolean(body.can_delete),
          Boolean(body.show_on_website),
        ]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  return router;
}