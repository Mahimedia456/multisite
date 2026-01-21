import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../services/db.js";
import { authMiddleware } from "../services/auth.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// ✅ Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const r = await pool.query(
      `SELECT id, email, password_hash, role FROM admins WHERE email=$1 LIMIT 1`,
      [String(email).toLowerCase()]
    );

    const admin = r.rows[0];
    if (!admin) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const access_token = signToken({ id: admin.id, email: admin.email, role: admin.role || "admin" });

    res.json({
      access_token,
      user: { id: admin.id, email: admin.email, role: admin.role || "admin" },
    });
  } catch (e) {
    console.error("POST /api/admin/login error:", e);
    res.status(500).json({ message: "Server error", error: e?.message, code: e?.code });
  }
});

// ✅ List shared pages (replaces inner-pages)
router.get("/shared-pages", authMiddleware, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();

    const vals = [];
    let where = "";
    if (q) {
      vals.push(`%${q}%`);
      where = `WHERE LOWER(slug) LIKE $1 OR LOWER(COALESCE(title,'')) LIKE $1`;
    }

    const r = await pool.query(
      `
      SELECT id, slug, title, status, updated_at
      FROM brand_shared_pages
      ${where}
      ORDER BY updated_at DESC NULLS LAST
      LIMIT 500
      `,
      vals
    );

    res.json({
      ok: true,
      data: r.rows.map((x) => ({
        id: x.id,
        slug: x.slug,
        title: x.title,
        status: x.status,
        modifiedAt: x.updated_at,
      })),
    });
  } catch (e) {
    console.error("GET /api/admin/shared-pages error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

// ✅ Shared page details (latest version)
router.get("/shared-pages/:pageId", authMiddleware, async (req, res) => {
  try {
    const pageId = String(req.params.pageId);

    const pageRes = await pool.query(
      `SELECT id, slug, title, status, updated_at FROM brand_shared_pages WHERE id=$1 LIMIT 1`,
      [pageId]
    );
    const page = pageRes.rows[0];
    if (!page) return res.status(404).json({ ok: false, message: "Shared page not found" });

    const vRes = await pool.query(
      `
      SELECT id, version, content, created_at
      FROM brand_shared_page_versions
      WHERE page_id=$1
      ORDER BY version DESC
      LIMIT 1
      `,
      [pageId]
    );

    res.json({
      ok: true,
      data: {
        ...page,
        modifiedAt: page.updated_at,
        version: vRes.rows[0]?.version ?? null,
        content: vRes.rows[0]?.content ?? null,
      },
    });
  } catch (e) {
    console.error("GET /api/admin/shared-pages/:pageId error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

// ✅ Save new version
router.post("/shared-pages/:pageId/versions", authMiddleware, async (req, res) => {
  try {
    const pageId = String(req.params.pageId);
    const content = req.body?.content;

    if (!content || typeof content !== "object") {
      return res.status(400).json({ ok: false, message: "content (object) is required" });
    }

    const v = await pool.query(
      `
      INSERT INTO brand_shared_page_versions (page_id, version, content)
      VALUES (
        $1,
        COALESCE((SELECT MAX(version)+1 FROM brand_shared_page_versions WHERE page_id=$1), 1),
        $2::jsonb
      )
      RETURNING id, page_id, version, created_at
      `,
      [pageId, JSON.stringify(content)]
    );

    // bump updated_at
    await pool.query(`UPDATE brand_shared_pages SET updated_at=now() WHERE id=$1`, [pageId]);

    res.json({ ok: true, data: v.rows[0] });
  } catch (e) {
    console.error("POST /api/admin/shared-pages/:pageId/versions error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

export default router;
