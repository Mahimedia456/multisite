import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /brands/:brandId/inner-pages
 */
router.get("/:brandId/inner-pages", requireAuth, async (req, res) => {
  try {
    const { brandId } = req.params;
    const q = (req.query.q || "").trim();

    const { rows } = await pool.query(
      `
      select id, slug, title, status, updated_at
      from inner_pages
      where scope = 'BRAND'
        and brand_id = $1
        and ($2 = '' or title ilike '%' || $2 || '%' or slug ilike '%' || $2 || '%')
      order by updated_at desc
      `,
      [brandId, q]
    );

    res.json({
      ok: true,
      data: rows.map(r => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        status: r.status,
        modifiedAt: r.updated_at
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to fetch inner pages" });
  }
});

/**
 * GET /brands/:brandId/inner-pages/:pageId
 */
router.get("/:brandId/inner-pages/:pageId", requireAuth, async (req, res) => {
  const { pageId } = req.params;

  const { rows } = await pool.query(
    `
    select p.*, v.content
    from inner_pages p
    join inner_page_versions v on v.page_id = p.id
    where p.id = $1
    order by v.version desc
    limit 1
    `,
    [pageId]
  );

  res.json({ ok: true, data: rows[0] });
});

export default router;
