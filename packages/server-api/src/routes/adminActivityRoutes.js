import express from "express";
import { getActorFromReq, logActivity } from "../utils/activityLogger.js";

function getUserEmail(req) {
  return String(
    req.user?.email ||
      req.user?.user?.email ||
      req.user?.admin?.email ||
      req.user?.admin_email ||
      ""
  ).toLowerCase();
}

function getUserRole(req) {
  return String(
    req.user?.role ||
      req.user?.user?.role ||
      req.user?.admin?.role ||
      ""
  ).toLowerCase();
}

function getForcedBrandSlug(req) {
  const email = getUserEmail(req);

  if (email.includes("allianz3")) return "kundler3";
  if (email.includes("allianz4")) return "allianz4";

  return "";
}

export default function adminActivityRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  router.get(
    "/admin/activity",
    authMiddleware,
    wrap(async (req, res) => {
      const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);

      const forcedSlug = getForcedBrandSlug(req);
      const role = getUserRole(req);
      const isBrandRole = Boolean(forcedSlug) || role.includes("brand");

      const vals = [];
      const where = [];

      if (isBrandRole && forcedSlug) {
        vals.push(forcedSlug);
        where.push(`LOWER(COALESCE(brand_slug,'')) = $${vals.length}`);
      }

      vals.push(limit);

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const result = await pool.query(
        `
        SELECT
          id,
          brand_id,
          brand_slug,
          brand_name,
          actor_email,
          actor_role,
          module_key,
          module_label,
          action,
          title,
          description,
          entity_type,
          entity_id,
          entity_slug,
          notify_email,
          email_sent,
          created_at
        FROM activity_logs
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT $${vals.length}
        `,
        vals
      );

      res.json({
        ok: true,
        data: result.rows,
      });
    })
  );

  router.post(
    "/admin/activity",
    authMiddleware,
    wrap(async (req, res) => {
      const actor = getActorFromReq(req);

      const saved = await logActivity(pool, {
        ...req.body,
        ...actor,
      });

      if (!saved) {
        return res.status(400).json({
          ok: false,
          message: "Activity could not be saved.",
        });
      }

      res.status(201).json({
        ok: true,
        data: saved,
      });
    })
  );

  return router;
}