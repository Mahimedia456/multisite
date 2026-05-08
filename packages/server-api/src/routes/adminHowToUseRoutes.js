import express from "express";

const VALID_MODULE_KEYS = new Set([
  "dashboard",
  "brands",
  "brand_inner_pages",
  "brand_unique_pages",
  "support_chat",
  "blogs",
  "blog_categories",
  "knowledge_area",
  "settings",
  "module_settings",
  "website_settings",
  "admin_settings",
]);

function normalizeRole(role) {
  return String(role || "").toLowerCase().trim();
}

function getReqRole(req) {
  const candidates = [
    req.user?.role,
    req.user?.user?.role,
    req.user?.admin?.role,
    req.user?.account_type,
    req.user?.user_type,
    req.user?.type,
  ];

  return normalizeRole(candidates.find(Boolean));
}

function getUserEmail(req) {
  const candidates = [
    req.user?.email,
    req.user?.user?.email,
    req.user?.admin?.email,
    req.user?.admin_email,
  ];

  return String(candidates.find(Boolean) || "").toLowerCase().trim();
}

function isFullAdmin(req) {
  const role = getReqRole(req);
  const email = getUserEmail(req);

  if (
    [
      "admin",
      "super_admin",
      "full_admin",
      "support_admin",
      "administrator",
      "global_admin",
    ].includes(role)
  ) {
    return true;
  }

  if (role.includes("admin") && !role.includes("brand")) {
    return true;
  }

  if (
    email.endsWith("@mahimediasolutions.com") &&
    !email.includes("allianz3") &&
    !email.includes("allianz4")
  ) {
    return true;
  }

  return false;
}

function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validatePayload(body) {
  const moduleKey = String(body?.module_key || "").trim();

  if (!VALID_MODULE_KEYS.has(moduleKey)) {
    return "Invalid module_key";
  }

  if (!String(body?.title_de || "").trim()) {
    return "German title is required";
  }

  const slug = cleanSlug(body?.slug || moduleKey);

  if (!slug) {
    return "Slug is required";
  }

  return "";
}

export default function adminHowToUseRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  router.get(
    "/admin/how-to-use",
    authMiddleware,
    wrap(async (req, res) => {
      const fullAdmin = isFullAdmin(req);

      const result = await pool.query(
        `
        SELECT
          id,
          module_key,
          slug,
          icon,
          sort_order,
          title_de,
          title_en,
          description_de,
          description_en,
          content_de,
          content_en,
          steps_de,
          steps_en,
          images_json,
          status,
          created_by,
          updated_by,
          created_at,
          updated_at
        FROM how_to_use_guides
        WHERE ($1::boolean = true OR status = 'active')
        ORDER BY sort_order ASC, title_de ASC
        `,
        [fullAdmin]
      );

      res.json({
        ok: true,
        can_manage: fullAdmin,
        data: result.rows,
      });
    })
  );

  router.get(
    "/admin/how-to-use/by-id/:id",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({
          ok: false,
          message: "Only full admin can edit guides",
        });
      }

      const result = await pool.query(
        `
        SELECT *
        FROM how_to_use_guides
        WHERE id = $1
        LIMIT 1
        `,
        [req.params.id]
      );

      if (!result.rowCount) {
        return res.status(404).json({
          ok: false,
          message: "Guide not found",
        });
      }

      res.json({
        ok: true,
        can_manage: true,
        data: result.rows[0],
      });
    })
  );

  router.get(
    "/admin/how-to-use/:slug",
    authMiddleware,
    wrap(async (req, res) => {
      const fullAdmin = isFullAdmin(req);

      const result = await pool.query(
        `
        SELECT *
        FROM how_to_use_guides
        WHERE slug = $1
          AND ($2::boolean = true OR status = 'active')
        LIMIT 1
        `,
        [req.params.slug, fullAdmin]
      );

      if (!result.rowCount) {
        return res.status(404).json({
          ok: false,
          message: "Guide not found",
        });
      }

      res.json({
        ok: true,
        can_manage: fullAdmin,
        data: result.rows[0],
      });
    })
  );

  router.post(
    "/admin/how-to-use",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({
          ok: false,
          message: "Only full admin can create guides",
        });
      }

      const error = validatePayload(req.body);

      if (error) {
        return res.status(400).json({
          ok: false,
          message: error,
        });
      }

      const email = getUserEmail(req);
      const slug = cleanSlug(req.body.slug || req.body.module_key);

      const result = await pool.query(
        `
        INSERT INTO how_to_use_guides (
          module_key,
          slug,
          icon,
          sort_order,
          title_de,
          title_en,
          description_de,
          description_en,
          content_de,
          content_en,
          steps_de,
          steps_en,
          images_json,
          status,
          created_by,
          updated_by
        )
        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, $10, $11::jsonb, $12::jsonb,
          $13::jsonb, $14, $15, $15
        )
        ON CONFLICT (module_key) DO NOTHING
        RETURNING *
        `,
        [
          req.body.module_key,
          slug,
          req.body.icon || "help",
          Number(req.body.sort_order || 0),
          req.body.title_de || "",
          req.body.title_en || "",
          req.body.description_de || "",
          req.body.description_en || "",
          req.body.content_de || "",
          req.body.content_en || "",
          JSON.stringify(parseJsonArray(req.body.steps_de)),
          JSON.stringify(parseJsonArray(req.body.steps_en)),
          JSON.stringify(parseJsonArray(req.body.images_json)),
          req.body.status || "active",
          email,
        ]
      );

      if (!result.rowCount) {
        return res.status(409).json({
          ok: false,
          message: "Guide already exists. Please edit the existing guide.",
        });
      }

      res.status(201).json({
        ok: true,
        can_manage: true,
        data: result.rows[0],
      });
    })
  );

  router.put(
    "/admin/how-to-use/:id",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({
          ok: false,
          message: "Only full admin can update guides",
        });
      }

      const error = validatePayload(req.body);

      if (error) {
        return res.status(400).json({
          ok: false,
          message: error,
        });
      }

      const email = getUserEmail(req);
      const slug = cleanSlug(req.body.slug || req.body.module_key);

      const result = await pool.query(
        `
        UPDATE how_to_use_guides
        SET
          module_key = $2,
          slug = $3,
          icon = $4,
          sort_order = $5,
          title_de = $6,
          title_en = $7,
          description_de = $8,
          description_en = $9,
          content_de = $10,
          content_en = $11,
          steps_de = $12::jsonb,
          steps_en = $13::jsonb,
          images_json = $14::jsonb,
          status = $15,
          updated_by = $16,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
        `,
        [
          req.params.id,
          req.body.module_key,
          slug,
          req.body.icon || "help",
          Number(req.body.sort_order || 0),
          req.body.title_de || "",
          req.body.title_en || "",
          req.body.description_de || "",
          req.body.description_en || "",
          req.body.content_de || "",
          req.body.content_en || "",
          JSON.stringify(parseJsonArray(req.body.steps_de)),
          JSON.stringify(parseJsonArray(req.body.steps_en)),
          JSON.stringify(parseJsonArray(req.body.images_json)),
          req.body.status || "active",
          email,
        ]
      );

      if (!result.rowCount) {
        return res.status(404).json({
          ok: false,
          message: "Guide not found",
        });
      }

      res.json({
        ok: true,
        can_manage: true,
        data: result.rows[0],
      });
    })
  );

  router.delete(
    "/admin/how-to-use/:id",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
        return res.status(403).json({
          ok: false,
          message: "Only full admin can delete guides",
        });
      }

      const result = await pool.query(
        `
        DELETE FROM how_to_use_guides
        WHERE id = $1
        RETURNING id
        `,
        [req.params.id]
      );

      if (!result.rowCount) {
        return res.status(404).json({
          ok: false,
          message: "Guide not found",
        });
      }

      res.json({
        ok: true,
        can_manage: true,
        deleted: true,
      });
    })
  );

  return router;
}