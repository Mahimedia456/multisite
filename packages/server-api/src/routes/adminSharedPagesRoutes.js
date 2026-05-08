import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";

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

async function downloadToBuffer(url) {
  const headers = {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(url, {
      redirect: "follow",
      headers,
    });

    if (r.ok) {
      const contentType =
        r.headers.get("content-type") || "application/octet-stream";
      const ab = await r.arrayBuffer();

      return {
        buffer: Buffer.from(ab),
        contentType,
      };
    }

    if ([429, 503, 502].includes(r.status) && attempt < 3) {
      await new Promise((s) => setTimeout(s, 700 * attempt));
      continue;
    }

    throw new Error(`Download failed ${r.status}: ${url}`);
  }

  throw new Error(`Download failed: ${url}`);
}

function guessExtFromContentType(contentType) {
  const ct = String(contentType || "").toLowerCase();

  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("svg")) return "svg";

  return "bin";
}

export default function adminSharedPagesRoutes({
  pool,
  authMiddleware,
  wrap,
  isUuid,
  normalizeStatus,
  supabaseAdmin,
  supabaseBucket,
}) {
  const router = express.Router();

  async function migrateImagesInJson({
    json,
    prefix = "shared-pages",
    pageKey = "unknown",
  }) {
    if (!supabaseAdmin) {
      return {
        updatedJson: json,
        replacements: [],
      };
    }

    const replacements = [];
    const seen = new Map();

    async function handleUrl(originalUrl, suggestedKey) {
      if (!isRemoteHttpUrl(originalUrl)) return originalUrl;
      if (isAlreadySupabaseStorageUrl(originalUrl)) return originalUrl;
      if (seen.has(originalUrl)) return seen.get(originalUrl);

      const hash = crypto
        .createHash("sha1")
        .update(originalUrl)
        .digest("hex")
        .slice(0, 12);

      const { buffer, contentType } = await downloadToBuffer(originalUrl);
      const ext = guessExtFromContentType(contentType);

      const safeKey = String(suggestedKey || `asset.${hash}`).replace(
        /[^a-z0-9.\-_]/gi,
        "_"
      );

      const path = `${prefix}/${pageKey}/${safeKey}.${ext}`;

      const { error } = await supabaseAdmin.storage
        .from(supabaseBucket)
        .upload(path, buffer, {
          contentType,
          upsert: true,
          cacheControl: "3600",
        });

      if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
      }

      const { data } = supabaseAdmin.storage
        .from(supabaseBucket)
        .getPublicUrl(path);

      const publicUrl = data?.publicUrl || originalUrl;

      seen.set(originalUrl, publicUrl);
      replacements.push({
        from: originalUrl,
        to: publicUrl,
      });

      return publicUrl;
    }

    async function walk(node, ctxKey = null) {
      if (Array.isArray(node)) {
        const out = [];

        for (const item of node) {
          out.push(await walk(item, ctxKey));
        }

        return out;
      }

      if (node && typeof node === "object") {
        const out = {};

        for (const [k, v] of Object.entries(node)) {
          if (k === "url" && typeof v === "string") {
            out[k] = await handleUrl(v, node.assetKey || node.key || ctxKey);
          } else if (typeof v === "string" && isRemoteHttpUrl(v)) {
            out[k] = await handleUrl(v, node.assetKey || node.key || k);
          } else {
            out[k] = await walk(v, node.assetKey || node.key || k);
          }
        }

        return out;
      }

      if (typeof node === "string" && isRemoteHttpUrl(node)) {
        return await handleUrl(node, ctxKey);
      }

      return node;
    }

    const cloned = JSON.parse(JSON.stringify(json));
    const updatedJson = await walk(cloned);

    return {
      updatedJson,
      replacements,
    };
  }

  async function upsertSharedPageV1({ pageId, content, status, userId }) {
    const createdBy = isUuid(userId) ? userId : null;

    const up = await pool.query(
      `
      INSERT INTO brand_shared_page_versions (
        page_id,
        version,
        content,
        created_by
      )
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
        `
        UPDATE brand_shared_pages
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        `,
        [pageId, nextStatus]
      );
    } else {
      await pool.query(
        `
        UPDATE brand_shared_pages
        SET updated_at = NOW()
        WHERE id = $1
        `,
        [pageId]
      );
    }

    return up.rows[0];
  }

  router.get(
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

      res.json({
        ok: true,
        data: rows,
      });
    })
  );

  router.get(
    "/admin/shared-pages/:pageId",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;

      if (!isUuid(pageId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid pageId",
        });
      }

      const pageQ = await pool.query(
        `
        SELECT id, slug, title, status, updated_at as "modifiedAt"
        FROM brand_shared_pages
        WHERE id = $1
        LIMIT 1
        `,
        [pageId]
      );

      if (!pageQ.rows.length) {
        return res.status(404).json({
          ok: false,
          message: "Shared page not found",
        });
      }

      const latestQ = await pool.query(
        `
        SELECT id, page_id, version, content, created_at, created_by
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
          ...pageQ.rows[0],
          latestVersion: latestQ.rows[0] ? latestQ.rows[0] : null,
        },
      });
    })
  );

  router.get(
    "/admin/shared-pages/:pageId/versions",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;

      if (!isUuid(pageId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid pageId",
        });
      }

      const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);

      const { rows } = await pool.query(
        `
        SELECT id, page_id, version, content, created_at, created_by
        FROM brand_shared_page_versions
        WHERE page_id = $1
        ORDER BY version DESC
        LIMIT $2
        `,
        [pageId, limit]
      );

      res.json({
        ok: true,
        data: rows,
      });
    })
  );

  router.put(
    "/admin/shared-pages/:pageId/content",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;

      if (!isUuid(pageId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid pageId",
        });
      }

      const { content, status } = req.body || {};

      if (!content || typeof content !== "object") {
        return res.status(400).json({
          ok: false,
          message: "content (object) is required",
        });
      }

      const { updatedJson, replacements } = await migrateImagesInJson({
        json: content,
        prefix: "shared-pages",
        pageKey: pageId,
      });

      const saved = await upsertSharedPageV1({
        pageId,
        content: updatedJson,
        status,
        userId: req.user?.id,
      });

      res.json({
        ok: true,
        data: saved,
        uploads: replacements,
      });
    })
  );

  router.post(
    "/admin/shared-pages/:pageId/versions",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;

      if (!isUuid(pageId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid pageId",
        });
      }

      const { content, status } = req.body || {};

      if (!content || typeof content !== "object") {
        return res.status(400).json({
          ok: false,
          message: "content (object) is required",
        });
      }

      const saved = await upsertSharedPageV1({
        pageId,
        content,
        status,
        userId: req.user?.id,
      });

      res.json({
        ok: true,
        data: saved,
      });
    })
  );

  router.get(
    "/admin/brands/:brandId/pages",
    authMiddleware,
    wrap(async (req, res) => {
      const { brandId } = req.params;

      if (!isUuid(brandId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid brandId",
        });
      }

      const { rows } = await pool.query(
        `
        SELECT id, slug, title, status, updated_at as "modifiedAt"
        FROM brand_shared_pages
        ORDER BY updated_at DESC NULLS LAST, id DESC
        LIMIT 500
        `
      );

      res.json({
        ok: true,
        data: rows,
      });
    })
  );

  router.post(
    "/admin/shared-pages/:pageId/migrate-assets",
    authMiddleware,
    wrap(async (req, res) => {
      const { pageId } = req.params;

      if (!isUuid(pageId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid pageId",
        });
      }

      const latestQ = await pool.query(
        `
        SELECT id, page_id, version, content
        FROM brand_shared_page_versions
        WHERE page_id = $1
        ORDER BY version DESC
        LIMIT 1
        `,
        [pageId]
      );

      if (!latestQ.rows.length) {
        return res.status(404).json({
          ok: false,
          message: "No versions found",
        });
      }

      const row = latestQ.rows[0];

      const { updatedJson, replacements } = await migrateImagesInJson({
        json: row.content,
        prefix: "shared-pages",
        pageKey: pageId,
      });

      await pool.query(
        `
        UPDATE brand_shared_page_versions
        SET content = $2, created_at = NOW()
        WHERE id = $1
        `,
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

  return router;
}