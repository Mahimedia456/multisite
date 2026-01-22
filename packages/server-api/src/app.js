// packages/server-api/src/index.js
// ✅ FULL UPDATED FILE (NO MISSING APIS)
// - CORS: allowlist via CORS_ORIGIN + optional *.vercel.app wildcard + localhost/127.0.0.1 ports
// - Preflight enabled
// - Supabase/Render SSL fix: rejectUnauthorized:false in production
// - Includes ALL APIs you posted (no missing shared-pages versions, layout versions, template save alias, etc.)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { parse } from "pg-connection-string";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import crypto from "crypto";

dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "multisite";

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

function isRemoteHttpUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

function isAlreadySupabaseStorageUrl(url) {
  return (
    typeof url === "string" &&
    (url.includes(".supabase.co/storage/v1/object/") ||
      url.includes(".supabase.co/storage/v1/s3/"))
  );
}

/**
 * Walk JSON and collect all { url } fields (including nested),
 * upload remote images to Supabase Storage, replace urls in JSON.
 */
async function migrateJsonImagesToBucket({ json, folder = "shared-pages", pageKey = "unknown" }) {
  if (!supabaseAdmin) {
    // env not set -> return unchanged
    return { updatedJson: json, replacements: [] };
  }

  const replacements = [];
  const seen = new Map(); // url -> newUrl

async function uploadOne(remoteUrl, assetKeyHint) {
  try {
    if (!isRemoteHttpUrl(remoteUrl)) return remoteUrl;
    if (isAlreadySupabaseStorageUrl(remoteUrl)) return remoteUrl;
    if (seen.has(remoteUrl)) return seen.get(remoteUrl);

    const resp = await fetch(remoteUrl, { redirect: "follow" });
    if (!resp.ok) return remoteUrl;

    const contentType =
      resp.headers.get("content-type") || "application/octet-stream";
    const arrayBuf = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // ext
    let ext = "bin";
    const ct = contentType.toLowerCase();
    if (ct.includes("jpeg") || ct.includes("jpg")) ext = "jpg";
    else if (ct.includes("png")) ext = "png";
    else if (ct.includes("webp")) ext = "webp";
    else if (ct.includes("gif")) ext = "gif";
    else if (ct.includes("svg")) ext = "svg";

    // stable filename
    const hash = crypto
      .createHash("sha1")
      .update(remoteUrl)
      .digest("hex")
      .slice(0, 16);

    const safeAsset = String(assetKeyHint || "")
      .replace(/[^a-z0-9._-]/gi, "_")
      .slice(0, 80);

    const fileName = safeAsset ? `${safeAsset}.${hash}.${ext}` : `${hash}.${ext}`;
    const path = `${folder}/${pageKey}/${fileName}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: true,
        cacheControl: "3600",
      });

    if (upErr) {
      console.error("Supabase upload error:", upErr.message);
      return remoteUrl;
    }

    const { data } = supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(path);

    const newUrl = data?.publicUrl || remoteUrl;

    seen.set(remoteUrl, newUrl);
    replacements.push({ from: remoteUrl, to: newUrl, path });

    return newUrl;
  } catch (e) {
    console.error("uploadOne failed:", e?.message);
    return remoteUrl;
  }
}



  async function walk(node) {
    if (!node) return node;

    if (Array.isArray(node)) {
      const out = [];
      for (const item of node) out.push(await walk(item));
      return out;
    }

    if (typeof node === "object") {
      const out = {};
      for (const [k, v] of Object.entries(node)) {
        // detect common image/url objects: { url, alt, assetKey }
        if (k === "url" && typeof v === "string") {
          const assetKeyHint =
            node.assetKey || node.key || node.alt || `${folder}.${pageKey}`;
          out[k] = await uploadOne(v, assetKeyHint);
        } else {
          out[k] = await walk(v);
        }
      }
      return out;
    }

    return node;
  }

  const updatedJson = await walk(json);
  return { updatedJson, replacements };
}
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
async function downloadToBuffer(url) {
  const headers = {
    // Unsplash source sometimes blocks unknown user agents
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
    // optional
    "cache-control": "no-cache",
  };

  // small retry for 503/429
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(url, { redirect: "follow", headers });

    if (r.ok) {
      const contentType = r.headers.get("content-type") || "application/octet-stream";
      const ab = await r.arrayBuffer();
      return { buffer: Buffer.from(ab), contentType };
    }

    // retry only on temp errors
    if ([429, 503, 502].includes(r.status) && attempt < 3) {
      await new Promise((s) => setTimeout(s, 700 * attempt));
      continue;
    }

    throw new Error(`Download failed ${r.status}: ${url}`);
  }
}


function guessExtFromContentType(contentType) {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("svg")) return "svg";
  return "bin";
}

async function migrateImagesInJson({
  json,
  prefix = "shared-pages",
  pageKey = "unknown",
}) {
  if (!supabaseAdmin) throw new Error("Supabase client not configured");

  const replacements = [];

  async function handleUrl(originalUrl, suggestedKey) {
    if (!isRemoteHttpUrl(originalUrl)) return originalUrl;
    if (isAlreadySupabaseStorageUrl(originalUrl)) return originalUrl;

    // stable filename
    const hash = crypto.createHash("sha1").update(originalUrl).digest("hex").slice(0, 12);

    const { buffer, contentType } = await downloadToBuffer(originalUrl);
    const ext = guessExtFromContentType(contentType);

    const safeKey = String(suggestedKey || `asset.${hash}`).replace(/[^a-z0-9.\-_]/gi, "_");
    const path = `${prefix}/${pageKey}/${safeKey}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: true,
        cacheControl: "3600",
      });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    const { data } = supabaseAdmin.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    const publicUrl = data?.publicUrl;

    replacements.push({ from: originalUrl, to: publicUrl });
    return publicUrl;
  }

  async function walk(node, ctxKey = null) {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) node[i] = await walk(node[i], ctxKey);
      return node;
    }

    if (node && typeof node === "object") {
      // common pattern: { url, assetKey }
      if (typeof node.url === "string" && isRemoteHttpUrl(node.url)) {
        node.url = await handleUrl(node.url, node.assetKey || ctxKey);
      }

      for (const k of Object.keys(node)) {
        node[k] = await walk(node[k], node.assetKey || k);
      }
      return node;
    }

    if (typeof node === "string" && isRemoteHttpUrl(node)) {
      return await handleUrl(node, ctxKey);
    }

    return node;
  }

  const cloned = JSON.parse(JSON.stringify(json));
  const updatedJson = await walk(cloned);

  return { updatedJson, replacements };
}
// add at top with imports already present:
// import { createClient } from "@supabase/supabase-js";
// import crypto from "crypto";

app.post(
  "/admin/upload",
  authMiddleware,
  wrap(async (req, res) => {
    if (!supabaseAdmin) {
      return res.status(500).json({ ok: false, message: "Supabase not configured" });
    }

    const { dataUrl, fileName, folder = "shared-pages" } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return res.status(400).json({ ok: false, message: "dataUrl (base64) is required" });
    }

    // parse data url: data:image/png;base64,xxxx
    const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
    if (!m) return res.status(400).json({ ok: false, message: "Invalid dataUrl" });

    const contentType = m[1];
    const b64 = m[2];
    const buffer = Buffer.from(b64, "base64");

    const ext =
      contentType.includes("png") ? "png" :
      contentType.includes("jpeg") ? "jpg" :
      contentType.includes("webp") ? "webp" :
      contentType.includes("gif") ? "gif" : "bin";

    const safeName = String(fileName || "asset")
      .replace(/[^a-z0-9._-]/gi, "_")
      .slice(0, 80);

    const hash = crypto.randomBytes(8).toString("hex");
    const path = `${folder}/${Date.now()}-${hash}-${safeName}.${ext}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .upload(path, buffer, { contentType, upsert: true, cacheControl: "3600" });

    if (upErr) {
      return res.status(500).json({ ok: false, message: upErr.message });
    }

    const { data } = supabaseAdmin.storage.from(SUPABASE_BUCKET).getPublicUrl(path);

    return res.json({ ok: true, url: data?.publicUrl, path });
  })
);

app.post(
  "/admin/shared-pages/:pageId/migrate-assets",
  authMiddleware,
  wrap(async (req, res) => {
    const { pageId } = req.params;
    if (!isUuid(pageId)) {
      return res.status(400).json({ ok: false, message: "Invalid pageId" });
    }

    const latestQ = await pool.query(
      `SELECT id, page_id, version, content
       FROM brand_shared_page_versions
       WHERE page_id = $1
       ORDER BY version DESC
       LIMIT 1`,
      [pageId]
    );

    if (!latestQ.rows.length) {
      return res.status(404).json({ ok: false, message: "No versions found" });
    }

    const row = latestQ.rows[0];

    const { updatedJson, replacements } = await migrateImagesInJson({
      json: row.content,
      prefix: "shared-pages",
      pageKey: pageId,
    });

    await pool.query(
      `UPDATE brand_shared_page_versions
       SET content = $2, created_at = NOW()
       WHERE id = $1`,
      [row.id, updatedJson]
    );

    res.json({
      ok: true,
      updatedVersionId: row.id,
      updatedVersion: row.version,
      replacementsCount: replacements.length,
      replacements,
    });
  })
);

/* =========================
   CORS (LOCAL + VERCEL + CUSTOM)
   - Uses CORS_ORIGIN allowlist if provided (comma-separated)
   - Optional: allow any *.vercel.app with ALLOW_VERCEL_WILDCARD=true
   - Allows localhost/127.0.0.1 ports 5173-5185
   - Handles preflight
========================= */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowVercelWildcard = process.env.ALLOW_VERCEL_WILDCARD === "true";

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser clients (curl/postman/server-side)
    if (!origin) return cb(null, true);

    // explicit allowlist
    if (allowedOrigins.length && allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    // optional allow any *.vercel.app
    if (allowVercelWildcard) {
      try {
        const host = new URL(origin).hostname;
        if (host.endsWith(".vercel.app")) return cb(null, true);
      } catch {
        // ignore parsing errors
      }
    }

    // dev: allow localhost/127.0.0.1 ports 5173-5185
    const m = /^http:\/\/(localhost|127\.0\.0\.1):(\d+)$/.exec(origin);
    if (m) {
      const port = Number(m[2]);
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

const PORT = Number(process.env.PORT || process.env.API_PORT || 5050);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const isProd = process.env.NODE_ENV === "production";

/* =========================
   DB (Supabase)
   FIX: Render/Supabase pooler SSL chain issues
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
    ssl: isProd ? { rejectUnauthorized: false } : false,
  });
} catch (e) {
  console.error("❌ Failed to create DB pool:", e);
  pool = new Pool({
    connectionString: dbUrl,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  });
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
   ✅ TEMPLATE SAVE FIX (TemplateBuilder)
   Adds:
     PUT /admin/brand-layout-templates/:id/content (main)
     PUT /admin/brand-templates/:id/content        (alias)
   Stores as SINGLE VERSION v1 (upsert)
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

// ALIAS (so existing TemplateBuilder URL works)
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
      return res
        .status(404)
        .json({ ok: false, message: "Shared page not found" });

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

    // ✅ migrate images -> supabase bucket
    const { updatedJson, replacements } = await migrateJsonImagesToBucket({
      json: content,
      folder: "shared-pages",
      pageKey: pageId,
    });

    // ✅ save json (with replaced urls)
    const saved = await upsertSharedPageV1({
      pageId,
      content: updatedJson,
      status,
      userId: req.user?.id,
    });

    res.json({ ok: true, data: saved, uploads: replacements });
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
export default app; // ✅ IMPORTANT