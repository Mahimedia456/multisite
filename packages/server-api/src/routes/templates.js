import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:key", requireAuth, async (req, res) => {
  const { key } = req.params;

  const { rows } = await pool.query(
    `
    select v.content
    from templates t
    join template_versions v on v.template_id = t.id
    where t.key = $1
    order by v.version desc
    limit 1
    `,
    [key]
  );

  res.json({ ok: true, data: rows[0]?.content });
});

export default router;
