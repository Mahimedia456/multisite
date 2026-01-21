import express from "express";
import { Pool } from "pg";

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
});

/**
 * GET /api/brands/:brandId
 * Brand variables + top templates (header/footer/home)
 */
router.get("/brands/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;

    // 1) brand variables
    const b = await pool.query(
      `
      SELECT
        id, name,
        accent_color,
        logo_type, logo_value,
        typography_name, typography_desc,
        logo_file_name, logo_file_meta
      FROM brands
      WHERE id = $1
      LIMIT 1
      `,
      [brandId]
    );

    if (!b.rows[0]) return res.status(404).json({ ok: false, message: "Brand not found" });

    const brandRow = b.rows[0];

    // 2) header/footer from brand_layout_templates
    const layout = await pool.query(
      `
      SELECT
        key,
        status,
        updated_at
      FROM brand_layout_templates
      WHERE brand_id = $1
        AND key IN ('header','footer')
      `,
      [brandId]
    );

    // 3) home from templates table
    const home = await pool.query(
      `
      SELECT
        key,
        status,
        updated_at
      FROM templates
      WHERE brand_id = $1
        AND key = 'home'
      LIMIT 1
      `,
      [brandId]
    );

    // normalize into UI card format
    const templates = [];

    const layoutMap = new Map(layout.rows.map(r => [r.key, r]));
    const header = layoutMap.get("header");
    const footer = layoutMap.get("footer");
    const homeRow = home.rows[0];

    templates.push({
      id: "header",
      title: "Global Header",
      status: header?.status || "draft",
      icon: "dock_to_bottom",
      edited: header?.updated_at ? new Date(header.updated_at).toLocaleString() : "—",
    });

    templates.push({
      id: "footer",
      title: "Global Footer",
      status: footer?.status || "draft",
      icon: "dock_to_bottom",
      edited: footer?.updated_at ? new Date(footer.updated_at).toLocaleString() : "—",
    });

    templates.push({
      id: "home",
      title: "Home Page",
      status: homeRow?.status || "draft",
      icon: "home",
      edited: homeRow?.updated_at ? new Date(homeRow.updated_at).toLocaleString() : "—",
    });

    return res.json({
      ok: true,
      brand: {
        id: brandRow.id,
        name: brandRow.name,
        accent: brandRow.accent_color || "#2563eb",
        logoType: brandRow.logo_type || "material",
        logoIcon: brandRow.logo_value || "pets",
        typography: {
          name: brandRow.typography_name || "Inter",
          desc: brandRow.typography_desc || "",
        },
        logoFile: {
          name: brandRow.logo_file_name || "",
          meta: brandRow.logo_file_meta || "",
        },
      },
      templates,
    });
  } catch (e) {
    console.error("GET /api/brands/:brandId error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e.message });
  }
});

/**
 * GET /api/brands/:brandId/templates/:key
 * key: header|footer|home
 * returns latest version content
 */
router.get("/brands/:brandId/templates/:key", async (req, res) => {
  try {
    const { brandId, key } = req.params;

    if (!["header", "footer", "home"].includes(key)) {
      return res.status(400).json({ ok: false, message: "Invalid template key" });
    }

    // header/footer => brand_layout_template_versions
    if (key === "header" || key === "footer") {
      const t = await pool.query(
        `
        SELECT id
        FROM brand_layout_templates
        WHERE brand_id = $1 AND key = $2
        LIMIT 1
        `,
        [brandId, key]
      );

      if (!t.rows[0]) return res.status(404).json({ ok: false, message: "Template not found" });

      const v = await pool.query(
        `
        SELECT content, created_at
        FROM brand_layout_template_versions
        WHERE template_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [t.rows[0].id]
      );

      return res.json({ ok: true, key, content: v.rows[0]?.content || null });
    }

    // home => template_versions
    const t = await pool.query(
      `
      SELECT id
      FROM templates
      WHERE brand_id = $1 AND key = 'home'
      LIMIT 1
      `,
      [brandId]
    );
    if (!t.rows[0]) return res.status(404).json({ ok: false, message: "Home template not found" });

    const v = await pool.query(
      `
      SELECT content, created_at
      FROM template_versions
      WHERE template_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [t.rows[0].id]
    );

    return res.json({ ok: true, key, content: v.rows[0]?.content || null });
  } catch (e) {
    console.error("GET template error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e.message });
  }
});

/**
 * POST /api/brands/:brandId/templates/:key/versions
 * Create new version
 */
router.post("/brands/:brandId/templates/:key/versions", async (req, res) => {
  try {
    const { brandId, key } = req.params;
    const { content, status } = req.body || {};

    if (!content) return res.status(400).json({ ok: false, message: "content is required" });
    if (!["header", "footer", "home"].includes(key)) {
      return res.status(400).json({ ok: false, message: "Invalid template key" });
    }

    // header/footer
    if (key === "header" || key === "footer") {
      // ensure template row exists
      const t = await pool.query(
        `
        INSERT INTO brand_layout_templates (brand_id, key, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (brand_id, key)
        DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
        RETURNING id
        `,
        [brandId, key, status || "draft"]
      );

      const templateId = t.rows[0].id;

      const v = await pool.query(
        `
        INSERT INTO brand_layout_template_versions (template_id, content)
        VALUES ($1, $2)
        RETURNING id, created_at
        `,
        [templateId, content]
      );

      return res.json({ ok: true, versionId: v.rows[0].id, createdAt: v.rows[0].created_at });
    }

    // home
    const t = await pool.query(
      `
      INSERT INTO templates (brand_id, key, status)
      VALUES ($1, 'home', $2)
      ON CONFLICT (brand_id, key)
      DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
      RETURNING id
      `,
      [brandId, status || "draft"]
    );

    const templateId = t.rows[0].id;

    const v = await pool.query(
      `
      INSERT INTO template_versions (template_id, content)
      VALUES ($1, $2)
      RETURNING id, created_at
      `,
      [templateId, content]
    );

    return res.json({ ok: true, versionId: v.rows[0].id, createdAt: v.rows[0].created_at });
  } catch (e) {
    console.error("POST version error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e.message });
  }
});

export default router;
