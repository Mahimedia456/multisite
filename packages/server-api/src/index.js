// server-api/index.js
// ✅ Full updated file
// - CORS fixed (localhost ports + env allowlist) + preflight
// - Adds missing endpoint for TemplateBuilder saving:
//   PUT /admin/brand-templates/:templateId/content  (alias)
//   PUT /admin/brand-layout-templates/:templateId/content (main)
//   (both use SINGLE VERSION v1 upsert like shared-pages, no new versions)
// - Adds support for uploading/saving images as URLs in JSON (content object is stored as JSONB as-is)
// - Adds /public/brand-assets/:path proxy (optional) to avoid CORS when loading images from a different origin

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { parse } from "pg-connection-string";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" })); // allow bigger JSON (image urls/arrays)

/* =========================
   Small utils
========================= */
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function isUuid(v) {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      v
    )
  );
}

function normalizeStatus(s) {
  const v = String(s || "").toLowerCase().trim();
  if (!v) return null;
  if (v === "published" || v === "live" || v === "active") return "PUBLISHED";
  if (v === "draft" || v === "inactive") return "DRAFT";
  return v.toUpperCase();
}

/* =========================
   CORS (FIXED)
   - Allows CORS_ORIGIN allowlist if set
   - Else allows localhost ports 5173-5185
   - Handles preflight
========================= */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser clients (curl/postman/server-side)
    if (!origin) return cb(null, true);

    // if env list exists, use it strictly
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
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ preflight

const PORT = Number(process.env.API_PORT || process.env.PORT || 5050);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const isProd = process.env.NODE_ENV === "production";

/* =========================
   DB (Supabase)
========================= */
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!dbUrl) console.warn("⚠️ DATABASE_URL/DIRECT_URL missing in .env");

let pool;
try {
  const cfg = parse(dbUrl || "");
  delete cfg.sslmode;
  delete cfg.sslMode;

  pool = new Pool({
    ...cfg,
    ssl: isProd ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
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
  if (!token)
    return res.status(401).json({ ok: false, message: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ ok: false, message: "Invalid or expired token" });
  }
}

/* =========================
   Health
========================= */
app.get("/", (req, res) => {
  res.json({ ok: true, service: "server-api", time: new Date().toISOString() });
});

app.get(
  "/debug/db",
  wrap(async (req, res) => {
    const r = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: r.rows[0]?.now });
  })
);

/* =========================
   Admin Login
========================= */
app.post(
  "/admin/login",
  wrap(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Email and password are required" });
    }

    const { rows } = await pool.query(
      `SELECT id, email, password_hash, role
       FROM admins
       WHERE email = $1
       LIMIT 1`,
      [String(email).toLowerCase()]
    );

    const admin = rows[0];
    if (!admin)
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok)
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password" });

    const access_token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role || "admin",
    });

    res.json({
      ok: true,
      access_token,
      user: { id: admin.id, email: admin.email, role: admin.role || "admin" },
    });
  })
);

/* =========================
   Brands list
========================= */
app.get(
  "/api/brands",
  authMiddleware,
  wrap(async (req, res) => {
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
        accent_color, primary_color, logo_type, logo_value,
        typography_json, nav_links_json, cta_json, brand_description,
        company_name, company_phone, company_whatsapp, company_email, company_location
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
        accentColor: r.accent_color,
        primaryColor: r.primary_color,
        logoType: r.logo_type,
        logoValue: r.logo_value,
        typography: r.typography_json,
        navLinks: r.nav_links_json,
        cta: r.cta_json,
        description: r.brand_description,
        company: {
          name: r.company_name,
          phone: r.company_phone,
          whatsapp: r.company_whatsapp,
          email: r.company_email,
          location: r.company_location,
        },
      })),
    });
  })
);

/* =========================
   Brand detail: header/footer templates + latest version
========================= */
app.get(
  "/admin/brands/:brandId/detail",
  authMiddleware,
  wrap(async (req, res) => {
    const { brandId } = req.params;
    if (!isUuid(brandId))
      return res.status(400).json({ ok: false, message: "Invalid brandId" });

    const brandQ = await pool.query(
      `
      SELECT
        id, name, route, status, updated_at,
        accent_color, primary_color, logo_type, logo_value,
        typography_json, nav_links_json, cta_json, brand_description,
        company_name, company_phone, company_whatsapp, company_email, company_location
      FROM brands
      WHERE id = $1
      LIMIT 1
      `,
      [brandId]
    );

    if (!brandQ.rows.length)
      return res.status(404).json({ ok: false, message: "Brand not found" });

    const b = brandQ.rows[0];
    const accent = b.accent_color || b.primary_color || "#2ec2b3";
    const typography = b.typography_json || {};

    const layoutsQ = await pool.query(
      `
      SELECT
        t.id,
        t.brand_id,
        t.key,
        t.title,
        t.status,
        t.updated_at,
        v.id as version_id,
        v.version,
        v.created_at,
        v.content
      FROM brand_layout_templates t
      LEFT JOIN LATERAL (
        SELECT id, version, created_at, content
        FROM brand_layout_template_versions
        WHERE template_id = t.id
        ORDER BY version DESC
        LIMIT 1
      ) v ON true
      WHERE t.brand_id = $1
        AND t.key IN ('header','footer')
      ORDER BY t.key ASC
      `,
      [brandId]
    );

    const templates = layoutsQ.rows.map((r) => ({
      id: r.id,
      brandId: r.brand_id,
      key: r.key,
      title: r.title,
      status: r.status,
      updatedAt: r.updated_at,
      latestVersion: r.version_id
        ? {
            id: r.version_id,
            version: r.version,
            content: r.content,
            createdAt: r.created_at,
          }
        : null,
    }));

    res.json({
      ok: true,
      data: {
        brand: {
          id: b.id,
          name: b.name,
          route: b.route,
          status: b.status,
          updatedAt: b.updated_at,
          colors: {
            primary: accent,
            accent: accent,
            primaryDark: null,
            accent2: null,
          },
          fonts: {
            family: typography.family || typography.fontFamily || null,
            googleUrl: typography.googleUrl || typography.google_font_url || null,
            iconsUrl: typography.iconsUrl || typography.icon_font_url || null,
          },
          logo: {
            type: b.logo_type || null,
            value: b.logo_value || null,
            text: b.name || "",
          },
          navLinks: b.nav_links_json || [],
          cta: b.cta_json || null,
          description: b.brand_description || "",
          company: {
            name: b.company_name || "",
            phone: b.company_phone || "",
            whatsapp: b.company_whatsapp || "",
            email: b.company_email || "",
            location: b.company_location || "",
          },
        },
        templates,
      },
    });
  })
);

/* =========================
   Brand variables update
========================= */
app.put(
  "/admin/brands/:brandId/variables",
  authMiddleware,
  wrap(async (req, res) => {
    const { brandId } = req.params;
    if (!isUuid(brandId))
      return res.status(400).json({ ok: false, message: "Invalid brandId" });

    const {
      accentColor,
      primaryColor,
      logoType,
      logoValue,
      typography,
      companyName,
      companyPhone,
      companyWhatsapp,
      companyEmail,
      companyLocation,
    } = req.body || {};

    const upd = await pool.query(
      `
      UPDATE brands
      SET
        accent_color = COALESCE($2, accent_color),
        primary_color = COALESCE($3, primary_color),
        logo_type = COALESCE($4, logo_type),
        logo_value = COALESCE($5, logo_value),
        typography_json = COALESCE($6, typography_json),
        company_name = COALESCE($7, company_name),
        company_phone = COALESCE($8, company_phone),
        company_whatsapp = COALESCE($9, company_whatsapp),
        company_email = COALESCE($10, company_email),
        company_location = COALESCE($11, company_location),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id, accent_color, primary_color, logo_type, logo_value, typography_json,
        company_name, company_phone, company_whatsapp, company_email, company_location, updated_at
      `,
      [
        brandId,
        accentColor ?? null,
        primaryColor ?? null,
        logoType ?? null,
        logoValue ?? null,
        typography ?? null,
        companyName ?? null,
        companyPhone ?? null,
        companyWhatsapp ?? null,
        companyEmail ?? null,
        companyLocation ?? null,
      ]
    );

    if (!upd.rows.length)
      return res.status(404).json({ ok: false, message: "Brand not found" });

    const r = upd.rows[0];
    res.json({
      ok: true,
      data: {
        brandId: r.id,
        accentColor: r.accent_color,
        primaryColor: r.primary_color,
        logoType: r.logo_type,
        logoValue: r.logo_value,
        typography: r.typography_json,
        company: {
          name: r.company_name,
          phone: r.company_phone,
          whatsapp: r.company_whatsapp,
          email: r.company_email,
          location: r.company_location,
        },
        updatedAt: r.updated_at,
      },
    });
  })
);

/* =========================
   Layout template versions (history list)
========================= */
app.get(
  "/admin/layout-templates/:templateId/versions",
  authMiddleware,
  wrap(async (req, res) => {
    const { templateId } = req.params;
    if (!isUuid(templateId))
      return res.status(400).json({ ok: false, message: "Invalid templateId" });

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

    res.json({ ok: true, data: rows });
  })
);

/* ============================================================
   ✅ TEMPLATE SAVE FIX (for your TemplateBuilder)
   Adds:
     PUT /admin/brand-templates/:id/content   (alias)
     PUT /admin/brand-layout-templates/:id/content (main)
   Stores as SINGLE VERSION v1 (upsert) like shared-pages.
============================================================ */
async function upsertLayoutTemplateV1({ templateId, content, status, userId }) {
  const createdBy = isUuid(userId) ? userId : null;

  // ensure template exists
  const t = await pool.query(
    `SELECT id FROM brand_layout_templates WHERE id = $1 LIMIT 1`,
    [templateId]
  );
  if (!t.rows.length) {
    const err = new Error("Template not found");
    err.statusCode = 404;
    throw err;
  }

  // single version row (version=1) with upsert
  const up = await pool.query(
    `
    INSERT INTO brand_layout_template_versions (template_id, version, content, created_by)
    VALUES ($1, 1, $2, $3)
    ON CONFLICT (template_id, version)
    DO UPDATE SET
      content = EXCLUDED.content,
      created_at = NOW(),
      created_by = EXCLUDED.created_by
    RETURNING id, template_id, version, content, created_at, created_by
    `,
    [templateId, content, createdBy]
  );

  const nextStatus = normalizeStatus(status);
  if (nextStatus) {
    await pool.query(
      `UPDATE brand_layout_templates SET status = $2, updated_at = NOW() WHERE id = $1`,
      [templateId, nextStatus]
    );
  } else {
    await pool.query(
      `UPDATE brand_layout_templates SET updated_at = NOW() WHERE id = $1`,
      [templateId]
    );
  }

  return up.rows[0];
}

// MAIN (recommended)
app.put(
  "/admin/brand-layout-templates/:templateId/content",
  authMiddleware,
  wrap(async (req, res) => {
    const { templateId } = req.params;
    if (!isUuid(templateId))
      return res.status(400).json({ ok: false, message: "Invalid templateId" });

    const { content, status } = req.body || {};
    if (!content || typeof content !== "object") {
      return res
        .status(400)
        .json({ ok: false, message: "content (object) is required" });
    }

    const saved = await upsertLayoutTemplateV1({
      templateId,
      content,
      status,
      userId: req.user?.id,
    });

    res.json({ ok: true, data: saved });
  })
);

// ALIAS (so your existing TemplateBuilder URL works)
app.put(
  "/admin/brand-templates/:templateId/content",
  authMiddleware,
  wrap(async (req, res) => {
    const { templateId } = req.params;
    if (!isUuid(templateId))
      return res.status(400).json({ ok: false, message: "Invalid templateId" });

    const { content, status } = req.body || {};
    if (!content || typeof content !== "object") {
      return res
        .status(400)
        .json({ ok: false, message: "content (object) is required" });
    }

    const saved = await upsertLayoutTemplateV1({
      templateId,
      content,
      status,
      userId: req.user?.id,
    });

    res.json({ ok: true, data: saved });
  })
);

// Backward compatible: old admin might still call POST /admin/layout-templates/:id/versions
// (kept as-is, creates new versions)
app.post(
  "/admin/layout-templates/:templateId/versions",
  authMiddleware,
  wrap(async (req, res) => {
    const { templateId } = req.params;
    if (!isUuid(templateId))
      return res.status(400).json({ ok: false, message: "Invalid templateId" });

    const { content, status } = req.body || {};
    if (!content || typeof content !== "object") {
      return res
        .status(400)
        .json({ ok: false, message: "content (object) is required" });
    }

    const t = await pool.query(
      `SELECT id FROM brand_layout_templates WHERE id = $1 LIMIT 1`,
      [templateId]
    );
    if (!t.rows.length)
      return res.status(404).json({ ok: false, message: "Template not found" });

    const next = await pool.query(
      `SELECT COALESCE(MAX(version), 0) + 1 AS v
       FROM brand_layout_template_versions
       WHERE template_id = $1`,
      [templateId]
    );
    const version = Number(next.rows[0].v);

    const createdBy = isUuid(req.user?.id) ? req.user.id : null;

    const created = await pool.query(
      `
      INSERT INTO brand_layout_template_versions (template_id, version, content, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, template_id, version, created_at, created_by
      `,
      [templateId, version, content, createdBy]
    );

    const nextStatus = normalizeStatus(status);
    if (nextStatus) {
      await pool.query(
        `UPDATE brand_layout_templates SET status = $2, updated_at = NOW() WHERE id = $1`,
        [templateId, nextStatus]
      );
    } else {
      await pool.query(
        `UPDATE brand_layout_templates SET updated_at = NOW() WHERE id = $1`,
        [templateId]
      );
    }

    res.json({ ok: true, data: created.rows[0] });
  })
);

/* =========================
   Shared Pages (global inner pages)
========================= */
app.get(
  "/admin/shared-pages",
  authMiddleware,
  wrap(async (req, res) => {
    const q = String(req.query.q ?? "").trim().toLowerCase();
    const like = `%${q}%`;

    const { rows } = await pool.query(
      `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.status,
        p.updated_at as "modifiedAt"
      FROM brand_shared_pages p
      WHERE ($1 = '' OR
        LOWER(p.slug) LIKE $2 OR
        LOWER(COALESCE(p.title,'')) LIKE $2 OR
        LOWER(COALESCE(p.status::text,'')) LIKE $2
      )
      ORDER BY p.updated_at DESC NULLS LAST, p.id DESC
      LIMIT 500
      `,
      [q, like]
    );

    res.json({ ok: true, data: rows });
  })
);

app.get(
  "/admin/shared-pages/:pageId",
  authMiddleware,
  wrap(async (req, res) => {
    const { pageId } = req.params;
    if (!isUuid(pageId))
      return res.status(400).json({ ok: false, message: "Invalid pageId" });

    const pageQ = await pool.query(
      `SELECT id, slug, title, status, updated_at as "modifiedAt"
       FROM brand_shared_pages
       WHERE id = $1
       LIMIT 1`,
      [pageId]
    );
    if (!pageQ.rows.length)
      return res.status(404).json({ ok: false, message: "Shared page not found" });

    const latestQ = await pool.query(
      `SELECT id, page_id, version, content, created_at, created_by
       FROM brand_shared_page_versions
       WHERE page_id = $1
       ORDER BY version DESC
       LIMIT 1`,
      [pageId]
    );

    res.json({
      ok: true,
      data: {
        ...pageQ.rows[0],
        latestVersion: latestQ.rows[0] ? latestQ.rows[0] : null,
      },
    });
  })
);

app.get(
  "/admin/shared-pages/:pageId/versions",
  authMiddleware,
  wrap(async (req, res) => {
    const { pageId } = req.params;
    if (!isUuid(pageId))
      return res.status(400).json({ ok: false, message: "Invalid pageId" });

    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);

    const { rows } = await pool.query(
      `SELECT id, page_id, version, content, created_at, created_by
       FROM brand_shared_page_versions
       WHERE page_id = $1
       ORDER BY version DESC
       LIMIT $2`,
      [pageId, limit]
    );

    res.json({ ok: true, data: rows });
  })
);

/* =========================
   ✅ SINGLE VERSION SAVE (v1) shared pages
========================= */
async function upsertSharedPageV1({ pageId, content, status, userId }) {
  const createdBy = isUuid(userId) ? userId : null;

  const up = await pool.query(
    `
    INSERT INTO brand_shared_page_versions (page_id, version, content, created_by)
    VALUES ($1, 1, $2, $3)
    ON CONFLICT (page_id, version)
    DO UPDATE SET
      content = EXCLUDED.content,
      created_at = NOW(),
      created_by = EXCLUDED.created_by
    RETURNING id, page_id, version, content, created_at, created_by
    `,
    [pageId, content, createdBy]
  );

  const nextStatus = normalizeStatus(status);
  if (nextStatus) {
    await pool.query(
      `UPDATE brand_shared_pages SET status = $2, updated_at = NOW() WHERE id = $1`,
      [pageId, nextStatus]
    );
  } else {
    await pool.query(
      `UPDATE brand_shared_pages SET updated_at = NOW() WHERE id = $1`,
      [pageId]
    );
  }

  return up.rows[0];
}

app.put(
  "/admin/shared-pages/:pageId/content",
  authMiddleware,
  wrap(async (req, res) => {
    const { pageId } = req.params;
    if (!isUuid(pageId))
      return res.status(400).json({ ok: false, message: "Invalid pageId" });

    const { content, status } = req.body || {};
    if (!content || typeof content !== "object") {
      return res
        .status(400)
        .json({ ok: false, message: "content (object) is required" });
    }

    const saved = await upsertSharedPageV1({
      pageId,
      content,
      status,
      userId: req.user?.id,
    });

    res.json({ ok: true, data: saved });
  })
);

app.post(
  "/admin/shared-pages/:pageId/versions",
  authMiddleware,
  wrap(async (req, res) => {
    const { pageId } = req.params;
    if (!isUuid(pageId))
      return res.status(400).json({ ok: false, message: "Invalid pageId" });

    const { content, status } = req.body || {};
    if (!content || typeof content !== "object") {
      return res
        .status(400)
        .json({ ok: false, message: "content (object) is required" });
    }

    const saved = await upsertSharedPageV1({
      pageId,
      content,
      status,
      userId: req.user?.id,
    });

    res.json({ ok: true, data: saved });
  })
);

/* =========================
   Brand pages (for now same shared pages)
========================= */
app.get(
  "/admin/brands/:brandId/pages",
  authMiddleware,
  wrap(async (req, res) => {
    const { brandId } = req.params;
    if (!isUuid(brandId))
      return res.status(400).json({ ok: false, message: "Invalid brandId" });

    const { rows } = await pool.query(
      `SELECT id, slug, title, status, updated_at as "modifiedAt"
       FROM brand_shared_pages
       ORDER BY updated_at DESC NULLS LAST, id DESC
       LIMIT 500`
    );

    res.json({ ok: true, data: rows });
  })
);

/* =========================
   PUBLIC: brand layout for frontend websites
========================= */
app.get(
  "/public/brands/:slug/layout",
  wrap(async (req, res) => {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    if (!slug)
      return res.status(400).json({ ok: false, message: "slug is required" });

    const bq = await pool.query(
      `SELECT id, name, slug, route
       FROM brands
       WHERE LOWER(slug) = $1
       LIMIT 1`,
      [slug]
    );
    if (!bq.rows.length)
      return res.status(404).json({ ok: false, message: "Brand not found" });

    const brand = bq.rows[0];

    const layoutsQ = await pool.query(
      `
      SELECT
        t.key,
        v.content
      FROM brand_layout_templates t
      LEFT JOIN LATERAL (
        SELECT content
        FROM brand_layout_template_versions
        WHERE template_id = t.id
        ORDER BY version DESC
        LIMIT 1
      ) v ON true
      WHERE t.brand_id = $1
        AND t.key IN ('header','footer')
      `,
      [brand.id]
    );

    const header =
      layoutsQ.rows.find((r) => r.key === "header")?.content || null;
    const footer =
      layoutsQ.rows.find((r) => r.key === "footer")?.content || null;

    res.json({
      ok: true,
      data: {
        brand: {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          route: brand.route,
        },
        header,
        footer,
      },
    });
  })
);

/* =========================
   PUBLIC: shared page by slug (latest version)
========================= */
app.get(
  "/public/shared-pages/:slug",
  wrap(async (req, res) => {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    if (!slug)
      return res.status(400).json({ ok: false, message: "slug is required" });

    const pageQ = await pool.query(
      `
      SELECT id, slug, title, status, updated_at
      FROM brand_shared_pages
      WHERE LOWER(slug) = $1
      LIMIT 1
      `,
      [slug]
    );

    if (!pageQ.rows.length)
      return res.status(404).json({ ok: false, message: "Page not found" });

    const page = pageQ.rows[0];

    const latestQ = await pool.query(
      `
      SELECT id, version, content, created_at
      FROM brand_shared_page_versions
      WHERE page_id = $1
      ORDER BY version DESC
      LIMIT 1
      `,
      [page.id]
    );

    const latest = latestQ.rows[0] || null;

    res.json({
      ok: true,
      data: {
        page: {
          id: page.id,
          slug: page.slug,
          title: page.title,
          status: page.status,
          updatedAt: page.updated_at,
        },
        latestVersion: latest
          ? {
              id: latest.id,
              version: latest.version,
              content: latest.content,
              createdAt: latest.created_at,
            }
          : null,
      },
    });
  })
);

/* =========================
   Global error handler
========================= */
app.use((err, req, res, next) => {
  const status = err?.statusCode || 500;
  console.error("UNHANDLED ERROR:", {
    path: req.path,
    method: req.method,
    message: err?.message,
    code: err?.code,
    stack: err?.stack,
  });
  res.status(status).json({
    ok: false,
    message: status === 500 ? "Server error" : err?.message || "Error",
    error: err?.message,
    code: err?.code,
  });
});

/* =========================
   Start
========================= */
app.listen(PORT, () => {
  console.log(`✅ server-api running on http://localhost:${PORT}`);
});
