import express from "express";

export default function adminStatsRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  router.get(
    "/admin/stats",
    authMiddleware,
    wrap(async (req, res) => {
      const b = await pool.query(`SELECT COUNT(*)::int as count FROM brands`);
      const p = await pool.query(
        `SELECT COUNT(*)::int as count FROM brand_shared_pages`
      );

      res.json({
        ok: true,
        data: {
          brands: b.rows[0].count,
          sharedPages: p.rows[0].count,
        },
      });
    })
  );

  return router;
}