import express from "express";

export default function adminLayoutTemplateRoutes({
  pool,
  authMiddleware,
  wrap,
  isUuid,
  normalizeStatus,
}) {
  const router = express.Router();

  async function createLayoutTemplateVersion({
    templateId,
    content,
    status,
    userId,
  }) {
    const createdBy = isUuid(userId) ? userId : null;

    const t = await pool.query(
      `
      SELECT id
      FROM brand_layout_templates
      WHERE id = $1
      LIMIT 1
      `,
      [templateId]
    );

    if (!t.rows.length) {
      const err = new Error("Template not found");
      err.statusCode = 404;
      throw err;
    }

    const next = await pool.query(
      `
      SELECT COALESCE(MAX(version), 0) + 1 AS v
      FROM brand_layout_template_versions
      WHERE template_id = $1
      `,
      [templateId]
    );

    const version = Number(next.rows[0].v);

    const created = await pool.query(
      `
      INSERT INTO brand_layout_template_versions (
        template_id,
        version,
        content,
        created_by
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, template_id, version, content, created_at, created_by
      `,
      [templateId, version, content, createdBy]
    );

    const nextStatus = normalizeStatus(status);

    if (nextStatus) {
      await pool.query(
        `
        UPDATE brand_layout_templates
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        `,
        [templateId, nextStatus]
      );
    } else {
      await pool.query(
        `
        UPDATE brand_layout_templates
        SET updated_at = NOW()
        WHERE id = $1
        `,
        [templateId]
      );
    }

    return created.rows[0];
  }

  router.get(
    "/admin/layout-templates/:templateId/versions",
    authMiddleware,
    wrap(async (req, res) => {
      const { templateId } = req.params;

      if (!isUuid(templateId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid templateId",
        });
      }

      const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);

      const { rows } = await pool.query(
        `
        SELECT id, template_id, version, content, created_at, created_by
        FROM brand_layout_template_versions
        WHERE template_id = $1
        ORDER BY version DESC
        LIMIT $2
        `,
        [templateId, limit]
      );

      res.json({
        ok: true,
        data: rows,
      });
    })
  );

  router.put(
    "/admin/brand-layout-templates/:templateId/content",
    authMiddleware,
    wrap(async (req, res) => {
      const { templateId } = req.params;

      if (!isUuid(templateId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid templateId",
        });
      }

      const { content, status } = req.body || {};

      if (!content || typeof content !== "object") {
        return res.status(400).json({
          ok: false,
          message: "content (object) is required",
        });
      }

      const saved = await createLayoutTemplateVersion({
        templateId,
        content,
        status,
        userId: req.user?.id,
      });

      return res.json({
        ok: true,
        data: saved,
      });
    })
  );

  router.put(
    "/admin/brand-templates/:templateId/content",
    authMiddleware,
    wrap(async (req, res) => {
      const { templateId } = req.params;

      if (!isUuid(templateId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid templateId",
        });
      }

      const { content, status } = req.body || {};

      if (!content || typeof content !== "object") {
        return res.status(400).json({
          ok: false,
          message: "content (object) is required",
        });
      }

      const saved = await createLayoutTemplateVersion({
        templateId,
        content,
        status,
        userId: req.user?.id,
      });

      return res.json({
        ok: true,
        data: saved,
      });
    })
  );

  router.post(
    "/admin/layout-templates/:templateId/versions",
    authMiddleware,
    wrap(async (req, res) => {
      const { templateId } = req.params;

      if (!isUuid(templateId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid templateId",
        });
      }

      const { content, status } = req.body || {};

      if (!content || typeof content !== "object") {
        return res.status(400).json({
          ok: false,
          message: "content (object) is required",
        });
      }

      const saved = await createLayoutTemplateVersion({
        templateId,
        content,
        status,
        userId: req.user?.id,
      });

      return res.json({
        ok: true,
        data: saved,
      });
    })
  );

  return router;
}