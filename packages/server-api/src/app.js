// packages/server-api/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { parse } from "pg-connection-string";
import { createClient } from "@supabase/supabase-js";

import brandUniquePagesRoutes from "./routes/brandUniquePages.js";
import brandSupportChatRoutes from "./routes/brandSupportChat.js";
import passwordResetRoutes from "./routes/passwordReset.js";
import blogsRoutes from "./routes/blogs.js";
import moduleSettingsRoutes from "./routes/moduleSettings.js";
import adminSettingsRoutes from "./routes/adminSettings.js";
import websiteSettingsRoutes from "./routes/websiteSettings.js";
import brandsRoutes from "./routes/brands.js";
import adminKnowledgeRoutes from "./routes/adminKnowledgeRoutes.js";
import adminHowToUseRoutes from "./routes/adminHowToUseRoutes.js";
import adminDashboardSummaryRoutes from "./routes/adminDashboardSummaryRoutes.js";
import adminActivityRoutes from "./routes/adminActivityRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import adminUploadRoutes from "./routes/adminUploadRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import adminBrandVariablesRoutes from "./routes/adminBrandVariablesRoutes.js";
import adminLayoutTemplateRoutes from "./routes/adminLayoutTemplateRoutes.js";
import adminSharedPagesRoutes from "./routes/adminSharedPagesRoutes.js";
import publicBrandRoutes from "./routes/publicBrandRoutes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

/* =========================
   CORS
========================= */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowVercelWildcard = process.env.ALLOW_VERCEL_WILDCARD === "true";

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    if (allowVercelWildcard) {
      try {
        const host = new URL(origin).hostname;
        if (host.endsWith(".vercel.app")) return cb(null, true);
      } catch {}
    }

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
app.options("*", cors(corsOptions));

/* =========================
   ENV / DB / Supabase
========================= */
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const isProd = process.env.NODE_ENV === "production";

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  console.warn("⚠️ DATABASE_URL/DIRECT_URL missing in .env");
}

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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "multisite";

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

/* =========================
   No-cache public APIs
========================= */
app.use((req, res, next) => {
  if (req.path.startsWith("/public/")) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  }

  next();
});

/* =========================
   Common helpers
========================= */
const MODULE_LABELS = {
  overview: "Overview",
  brands: "Brands",
  support_chat: "Support Chat",
  blogs: "Blogs",
  blog_settings: "Blog Settings",
  blog_categories: "Blog Categories",
  module_settings: "Module Settings",
  admin_settings: "Admin Settings",
  website_settings: "Website Settings",
  brand_unique_pages: "Brand Unique Pages",
  brand_inner_pages: "Brand Inner Pages",
  settings: "Settings",

  knowledge_area: "Knowledge Area",
  knowledge_categories: "Knowledge Categories",
  knowledge_articles: "Knowledge Articles",
  knowledge_faqs: "Knowledge FAQs",
  knowledge_forms: "Knowledge Forms",
  knowledge_submissions: "Knowledge Submissions",
  knowledge_settings: "Knowledge Settings",
};

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

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Missing token",
    });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
}

const context = {
  pool,
  authMiddleware,
  wrap,
  isUuid,
  normalizeStatus,
  supabaseAdmin,
  supabaseBucket: SUPABASE_BUCKET,
  signToken,
  moduleLabels: MODULE_LABELS,
};

/* =========================
   Health
========================= */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "server-api",
    time: new Date().toISOString(),
  });
});

app.get(
  "/debug/db",
  wrap(async (req, res) => {
    const r = await pool.query("SELECT NOW() as now");
    res.json({
      ok: true,
      now: r.rows[0]?.now,
    });
  })
);

/* =========================
   Route mounts
========================= */
app.use(authRoutes(context));

app.use(
  brandUniquePagesRoutes({
    pool,
    authMiddleware,
    wrap,
    isUuid,
    normalizeStatus,
  })
);

passwordResetRoutes({ pool, wrap })(app);

app.use(
  brandSupportChatRoutes({
    pool,
    authMiddleware,
    wrap,
    isUuid,
  })
);

app.use("/api", brandsRoutes);

app.use(
  blogsRoutes({
    pool,
    authMiddleware,
    wrap,
    isUuid,
  })
);

app.use(
  moduleSettingsRoutes({
    pool,
    authMiddleware,
    wrap,
    isUuid,
  })
);

app.use(
  adminSettingsRoutes({
    pool,
    authMiddleware,
    wrap,
  })
);

app.use(
  websiteSettingsRoutes({
    pool,
    authMiddleware,
    wrap,
    isUuid,
  })
);

app.use(
  adminKnowledgeRoutes({
    pool,
    authMiddleware,
    wrap,
  })
);

app.use(
  adminHowToUseRoutes({
    pool,
    authMiddleware,
    wrap,
  })
);

app.use(
  adminActivityRoutes({
    pool,
    authMiddleware,
    wrap,
  })
);

app.use(
  adminDashboardSummaryRoutes({
    pool,
    authMiddleware,
    wrap,
  })
);

app.use(adminUploadRoutes(context));
app.use(adminStatsRoutes(context));
app.use(adminBrandVariablesRoutes(context));
app.use(adminLayoutTemplateRoutes(context));
app.use(adminSharedPagesRoutes(context));
app.use(publicBrandRoutes(context));

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

export { authMiddleware };
export default app;