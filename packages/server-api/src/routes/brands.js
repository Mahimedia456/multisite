import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/brands/:brandId
 * Brand variables + top templates (header/footer/home)
 */
router.get("/brands/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;

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

    const layout = await pool.query(
      `
      SELECT key, status, updated_at
      FROM brand_layout_templates
      WHERE brand_id = $1
        AND key IN ('header','footer')
      `,
      [brandId]
    );

    const home = await pool.query(
      `
      SELECT key, status, updated_at
      FROM templates
      WHERE brand_id = $1
        AND key = 'home'
      LIMIT 1
      `,
      [brandId]
    );

    const templates = [];
    const layoutMap = new Map(layout.rows.map((r) => [r.key, r]));
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
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

export default router;
