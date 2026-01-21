import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { parse } from "pg-connection-string";

dotenv.config();

const app = express();
app.use(express.json());

/* =========================
   CORS
========================= */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (allowedOrigins.length) {
        return cb(null, allowedOrigins.includes(origin));
      }

      // dev: allow localhost:5173-5185
      const m = /^http:\/\/localhost:(\d+)$/.exec(origin);
      if (m) {
        const port = Number(m[1]);
        if (port >= 5173 && port <= 5185) return cb(null, true);
      }

      return cb(null, false);
    },
    credentials: true,
  })
);

const PORT = Number(process.env.API_PORT || process.env.PORT || 5050);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const isProd = process.env.NODE_ENV === "production";

/* =========================
   DB (Supabase) + SSL FIX
========================= */
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!dbUrl) console.warn("⚠️ DATABASE_URL/DIRECT_URL missing in .env");

let pool;
try {
  const cfg = parse(dbUrl || "");

  // remove possible conflicting sslmode fields
  delete cfg.sslmode;
  delete cfg.sslMode;

  pool = new Pool({
    ...cfg,
    ssl: isProd
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false }, // ✅ dev: fixes SELF_SIGNED_CERT_IN_CHAIN
  });
} catch (e) {
  console.error("❌ Failed to create DB pool:", e);
  pool = new Pool({ connectionString: dbUrl });
}

/* =========================
   Auth helpers
========================= */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/* =========================
   Health / Debug
========================= */
app.get("/", (req, res) => {
  res.json({ ok: true, service: "server-api", time: new Date().toISOString() });
});

app.get("/debug/db", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: r.rows[0]?.now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message, code: e?.code });
  }
});

/* =========================
   Admin Login
========================= */
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { rows } = await pool.query(
      `SELECT id, email, password_hash, role
       FROM admins
       WHERE email = $1
       LIMIT 1`,
      [String(email).toLowerCase()]
    );

    const admin = rows[0];
    if (!admin) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const access_token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role || "admin",
    });

    return res.json({
      access_token,
      user: { id: admin.id, email: admin.email, role: admin.role || "admin" },
    });
  } catch (e) {
    console.error("POST /admin/login error:", e);
    return res.status(500).json({ message: "Server error", error: e?.message, code: e?.code });
  }
});

/* =========================
   Brands
========================= */
app.get("/api/brands", authMiddleware, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    const status = String(req.query.status || "all").toLowerCase();

    const where = [];
    const vals = [];

    if (status !== "all") {
      vals.push(status);
      where.push(`status = $${vals.length}`);
    }

    if (q) {
      vals.push(`%${q}%`);
      where.push(
        `(LOWER(name) LIKE $${vals.length}
          OR LOWER(route) LIKE $${vals.length}
          OR LOWER(COALESCE(status,'')) LIKE $${vals.length})`
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `
      SELECT
        id, name, route, status, updated_at,
        accent_color, logo_type, logo_value,
        typography_json, nav_links_json, cta_json, brand_description
      FROM brands
      ${whereSql}
      ORDER BY updated_at DESC NULLS LAST, id DESC
      LIMIT 500
      `,
      vals
    );

    res.json({
      ok: true,
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        route: r.route,
        status: r.status || "inactive",
        updatedAt: r.updated_at,

        // UI config for header/footer etc
        accentColor: r.accent_color,
        logoType: r.logo_type,
        logoValue: r.logo_value,
        typography: r.typography_json,
        navLinks: r.nav_links_json,
        cta: r.cta_json,
        description: r.brand_description,

        templates: 0, // you can compute later
        icon: "business",
        iconBg: "bg-zinc-100",
        iconColor: "text-zinc-500",
      })),
    });
  } catch (e) {
    console.error("GET /api/brands error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

/**
 * Brand detail config (for BrandDetail page: colors/logo/typography)
 */
app.get("/admin/brands/:brandId", authMiddleware, async (req, res) => {
  try {
    const brandId = req.params.brandId;

    const { rows } = await pool.query(
      `
      SELECT
        id, name, route, status, updated_at,
        accent_color, logo_type, logo_value,
        typography_json, nav_links_json, cta_json, brand_description
      FROM brands
      WHERE id = $1
      LIMIT 1
      `,
      [brandId]
    );

    if (!rows.length) return res.status(404).json({ ok: false, message: "Brand not found" });

    const b = rows[0];

    return res.json({
      ok: true,
      data: {
        id: b.id,
        name: b.name,
        route: b.route,
        status: b.status,
        updatedAt: b.updated_at,
        accentColor: b.accent_color,
        logoType: b.logo_type,
        logoValue: b.logo_value,
        typography: b.typography_json,
        navLinks: b.nav_links_json,
        cta: b.cta_json,
        description: b.brand_description,
      },
    });
  } catch (e) {
    console.error("GET /admin/brands/:brandId error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

/* =========================
   ✅ Shared Pages (About/Services/etc) used by ALL brands
   Fixes your 404: /admin/shared-pages
========================= */
app.get("/admin/shared-pages", authMiddleware, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();

    const vals = [];
    let whereSql = `WHERE scope = 'BRAND'`; // only brand shared pages

    if (q) {
      vals.push(`%${q}%`);
      whereSql += `
        AND (
          LOWER(slug) LIKE $1
          OR LOWER(COALESCE(title,'')) LIKE $1
          OR LOWER(COALESCE(status::text,'')) LIKE $1
        )
      `;
    }

    const { rows } = await pool.query(
      `
      SELECT id, slug, title, status, updated_at as "modifiedAt"
      FROM brand_shared_pages
      ${whereSql}
      ORDER BY updated_at DESC NULLS LAST, id DESC
      LIMIT 500
      `,
      vals
    );

    res.json({ ok: true, data: rows });
  } catch (e) {
    console.error("GET /admin/shared-pages error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

app.get("/admin/shared-pages/:pageId", authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await pool.query(
      `SELECT id, slug, title, status, updated_at as "modifiedAt"
       FROM brand_shared_pages
       WHERE id = $1
       LIMIT 1`,
      [pageId]
    );

    if (!page.rows.length) {
      return res.status(404).json({ ok: false, message: "Shared page not found" });
    }

    // latest version content
    const ver = await pool.query(
      `
      SELECT id, version, content_json, created_at
      FROM brand_shared_page_versions
      WHERE page_id = $1
      ORDER BY version DESC
      LIMIT 1
      `,
      [pageId]
    );

    res.json({
      ok: true,
      data: {
        ...page.rows[0],
        latestVersion: ver.rows[0]
          ? {
              id: ver.rows[0].id,
              version: ver.rows[0].version,
              content: ver.rows[0].content_json,
              createdAt: ver.rows[0].created_at,
            }
          : null,
      },
    });
  } catch (e) {
    console.error("GET /admin/shared-pages/:pageId error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

/**
 * Create a new version for a shared page (save your JSON template)
 * body: { content: {...}, status?: 'DRAFT'|'PUBLISHED' }
 */
app.post("/admin/shared-pages/:pageId/versions", authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { content, status } = req.body || {};

    if (!content || typeof content !== "object") {
      return res.status(400).json({ ok: false, message: "content (object) is required" });
    }

    // ensure page exists
    const page = await pool.query(
      `SELECT id FROM brand_shared_pages WHERE id = $1 LIMIT 1`,
      [pageId]
    );
    if (!page.rows.length) {
      return res.status(404).json({ ok: false, message: "Shared page not found" });
    }

    // next version
    const next = await pool.query(
      `SELECT COALESCE(MAX(version), 0) + 1 AS v
       FROM brand_shared_page_versions
       WHERE page_id = $1`,
      [pageId]
    );
    const version = Number(next.rows[0].v);

    const created = await pool.query(
      `
      INSERT INTO brand_shared_page_versions (page_id, version, content_json)
      VALUES ($1, $2, $3)
      RETURNING id, page_id, version, created_at
      `,
      [pageId, version, content]
    );

    if (status) {
      await pool.query(
        `UPDATE brand_shared_pages
         SET status = $2, updated_at = NOW()
         WHERE id = $1`,
        [pageId, status]
      );
    } else {
      await pool.query(
        `UPDATE brand_shared_pages SET updated_at = NOW() WHERE id = $1`,
        [pageId]
      );
    }

    res.json({ ok: true, data: created.rows[0] });
  } catch (e) {
    console.error("POST /admin/shared-pages/:pageId/versions error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});
app.get("/admin/brands/:brandId/detail", authMiddleware, async (req, res) => {
  try {
    const { brandId } = req.params;

    const brandQ = await pool.query(
      `
      SELECT
        id, name, route, status, updated_at,
        accent_color, primary_color, primary_dark_color, accent_color_2,
        background_light, background_dark, surface_light, surface_dark,
        font_family, font_google_url, icon_font_url,
        logo_type, logo_value, logo_text,
        nav_links_json, cta_json, brand_description
      FROM brands
      WHERE id = $1
      LIMIT 1
      `,
      [brandId]
    );

    if (!brandQ.rows.length) {
      return res.status(404).json({ ok: false, message: "Brand not found" });
    }

    const brand = brandQ.rows[0];

    // layout templates: HEADER/FOOTER/HOME
    const layoutsQ = await pool.query(
      `
      SELECT
        t.id,
        t.key,
        t.title,
        t.status,
        t.updated_at,
        v.id as version_id,
        v.version,
        v.content_json,
        v.created_at
      FROM brand_layout_templates t
      LEFT JOIN LATERAL (
        SELECT *
        FROM brand_layout_template_versions
        WHERE template_id = t.id
        ORDER BY version DESC
        LIMIT 1
      ) v ON true
      WHERE t.brand_id = $1
        AND t.key IN ('header','footer','home')
      ORDER BY t.key ASC
      `,
      [brandId]
    );

    const templates = layoutsQ.rows.map((r) => ({
      id: r.id,
      key: r.key,
      title: r.title,
      status: r.status,
      updatedAt: r.updated_at,
      latestVersion: r.version_id
        ? {
            id: r.version_id,
            version: r.version,
            content: r.content_json,
            createdAt: r.created_at,
          }
        : null,
    }));

    return res.json({
      ok: true,
      data: {
        brand: {
          id: brand.id,
          name: brand.name,
          route: brand.route,
          status: brand.status,
          updatedAt: brand.updated_at,

          colors: {
            primary: brand.primary_color,
            primaryDark: brand.primary_dark_color,
            accent: brand.accent_color,
            accent2: brand.accent_color_2,
            backgroundLight: brand.background_light,
            backgroundDark: brand.background_dark,
            surfaceLight: brand.surface_light,
            surfaceDark: brand.surface_dark,
          },

          fonts: {
            family: brand.font_family,
            googleUrl: brand.font_google_url,
            iconsUrl: brand.icon_font_url,
          },

          logo: {
            type: brand.logo_type,
            value: brand.logo_value,
            text: brand.logo_text,
          },

          navLinks: brand.nav_links_json || [],
          cta: brand.cta_json || null,
          description: brand.brand_description || "",
        },
        templates,
      },
    });
  } catch (e) {
    console.error("GET /admin/brands/:brandId/detail error:", e);
    return res.status(500).json({
      ok: false,
      message: "Server error",
      error: e?.message,
      code: e?.code,
    });
  }
});

app.get("/admin/shared-pages", authMiddleware, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    const vals = [];
    let whereSql = "";

    if (q) {
      vals.push(`%${q}%`);
      whereSql = `
        WHERE
          LOWER(p.slug) LIKE $1
          OR LOWER(COALESCE(p.title,'')) LIKE $1
          OR LOWER(COALESCE(p.status,'')) LIKE $1
      `;
    }

    const { rows } = await pool.query(
      `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.status,
        p.updated_at as "modifiedAt"
      FROM brand_shared_pages p
      ${whereSql}
      ORDER BY p.updated_at DESC NULLS LAST, p.id DESC
      LIMIT 500
      `,
      vals
    );

    res.json({ ok: true, data: rows });
  } catch (e) {
    console.error("GET /admin/shared-pages error:", e);
    res.status(500).json({ ok: false, message: "Server error", error: e?.message, code: e?.code });
  }
});

/* =========================
   Start
========================= */
app.listen(PORT, () => {
  console.log(`✅ server-api running on http://localhost:${PORT}`);
});
