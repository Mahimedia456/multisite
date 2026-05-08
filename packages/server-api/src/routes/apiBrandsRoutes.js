import express from "express";

export default function apiBrandsRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  router.get(
    "/api/brands",
    authMiddleware,
    wrap(async (req, res) => {
      const q = String(req.query.q || "").trim().toLowerCase();
      const status = String(req.query.status || "all").toLowerCase();

      const where = [];
      const vals = [];

      const email = String(req.user?.email || "").toLowerCase();

      let forcedSlug = "";
      if (email.includes("allianz3")) forcedSlug = "kundler3";
      if (email.includes("allianz4")) forcedSlug = "allianz4";

      if (forcedSlug) {
        vals.push(forcedSlug);
        where.push(`LOWER(COALESCE(slug,'')) = $${vals.length}`);
      }

      if (status !== "all") {
        vals.push(status);
        where.push(`LOWER(COALESCE(status,'')) = $${vals.length}`);
      }

      if (q) {
        vals.push(`%${q}%`);
        const idx = vals.length;

        where.push(
          `(LOWER(COALESCE(name,'')) LIKE $${idx}
            OR LOWER(COALESCE(slug,'')) LIKE $${idx}
            OR LOWER(COALESCE(route,'')) LIKE $${idx}
            OR LOWER(COALESCE(status,'')) LIKE $${idx})`
        );
      }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const { rows } = await pool.query(
        `
        SELECT
          id,
          name,
          slug,
          route,
          status,
          updated_at
        FROM brands
        ${whereSql}
        ORDER BY updated_at DESC NULLS LAST, id DESC
        LIMIT 500
        `,
        vals
      );

      return res.json({
        ok: true,
        debug: {
          email,
          forcedSlug,
          whereSql,
          vals,
        },
        data: rows,
      });
    })
  );

  return router;
}