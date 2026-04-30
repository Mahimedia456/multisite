import express from "express";
import { translateText } from "../utils/translateText.js";

const SUPPORT_EMAIL = "support@mahimediasolutions.com";

export default function brandSupportChatRoutes({
  pool,
  authMiddleware,
  wrap,
  isUuid,
}) {
  const router = express.Router();

  function getEmail(req) {
    return String(req.user?.email || "").toLowerCase();
  }

  function isSupportUser(req) {
    return getEmail(req) === SUPPORT_EMAIL;
  }

  function getBrandSlugFromUser(req) {
    return String(req.user?.brandSlug || "").trim().toLowerCase();
  }

  async function getBrandForUser(req) {
    const brandSlug = getBrandSlugFromUser(req);
    if (!brandSlug) return null;

    const q = await pool.query(
      `SELECT id, name, slug, route, status FROM brands WHERE LOWER(slug)=$1 LIMIT 1`,
      [brandSlug]
    );

    return q.rows[0] || null;
  }

  async function getOrCreateThread({ brandId, brandName }) {
    const threadQ = await pool.query(
      `
      INSERT INTO brand_support_threads (
        brand_id,
        subject,
        status,
        support_email,
        updated_at
      )
      VALUES ($1, $2, 'OPEN', $3, NOW())
      ON CONFLICT (brand_id)
      DO UPDATE SET updated_at = NOW(), support_email = $3
      RETURNING *
      `,
      [brandId, `${brandName} Support Chat`, SUPPORT_EMAIL]
    );

    return threadQ.rows[0];
  }

  router.get(
    "/admin/support-chat/brands",
    authMiddleware,
    wrap(async (req, res) => {
      if (isSupportUser(req)) {
        const { rows } = await pool.query(`
          SELECT id, name, slug, route, status, support_email, updated_at as "updatedAt"
          FROM brands
          ORDER BY updated_at DESC NULLS LAST, name ASC
        `);

        return res.json({ ok: true, data: rows });
      }

      const brand = await getBrandForUser(req);

      if (!brand) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      return res.json({ ok: true, data: [brand] });
    })
  );

  router.post(
    "/admin/support-chat/threads",
    authMiddleware,
    wrap(async (req, res) => {
      let { brandId } = req.body || {};

      if (isSupportUser(req)) {
        if (!isUuid(brandId)) {
          return res.status(400).json({ ok: false, message: "Invalid brandId" });
        }
      } else {
        const brand = await getBrandForUser(req);

        if (!brand) {
          return res.status(403).json({ ok: false, message: "Forbidden" });
        }

        brandId = brand.id;
      }

      const brandQ = await pool.query(
        `SELECT id, name, slug FROM brands WHERE id=$1 LIMIT 1`,
        [brandId]
      );

      if (!brandQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Brand not found" });
      }

      const brand = brandQ.rows[0];

      const thread = await getOrCreateThread({
        brandId: brand.id,
        brandName: brand.name,
      });

      return res.json({
        ok: true,
        data: { brand, thread },
      });
    })
  );

  router.get(
    "/admin/support-chat/threads",
    authMiddleware,
    wrap(async (req, res) => {
      const values = [];
      let whereSql = "";

      if (!isSupportUser(req)) {
        const brand = await getBrandForUser(req);

        if (!brand) {
          return res.status(403).json({ ok: false, message: "Forbidden" });
        }

        values.push(brand.id);
        whereSql = `WHERE t.brand_id = $1`;
      }

      const { rows } = await pool.query(
        `
        SELECT
          t.id,
          t.brand_id as "brandId",
          t.subject,
          t.status,
          t.support_email as "supportEmail",
          t.created_at as "createdAt",
          t.updated_at as "updatedAt",
          b.name as "brandName",
          b.slug as "brandSlug",
          b.route as "brandRoute",

          lm.sender_type as "lastSenderType",
          lm.created_at as "lastMessageAt",

          CASE
            WHEN $${values.length + 1} = true AND lm.sender_type = 'BRAND'
              THEN lm.translated_text
            WHEN $${values.length + 1} = true AND lm.sender_type = 'SUPPORT'
              THEN lm.original_text
            WHEN $${values.length + 1} = false AND lm.sender_type = 'BRAND'
              THEN lm.original_text
            WHEN $${values.length + 1} = false AND lm.sender_type = 'SUPPORT'
              THEN lm.translated_text
            ELSE NULL
          END as "lastMessage",

          unread.unread_count as "unreadCount"
        FROM brand_support_threads t
        JOIN brands b ON b.id = t.brand_id

        LEFT JOIN LATERAL (
          SELECT sender_type, original_text, translated_text, created_at
          FROM brand_support_messages
          WHERE thread_id = t.id
          ORDER BY created_at DESC
          LIMIT 1
        ) lm ON true

        LEFT JOIN LATERAL (
          SELECT COUNT(*)::int as unread_count
          FROM brand_support_messages m
          WHERE m.thread_id = t.id
            AND (
              ($${values.length + 1} = true AND m.sender_type='BRAND' AND m.read_by_support_at IS NULL)
              OR
              ($${values.length + 1} = false AND m.sender_type='SUPPORT' AND m.read_by_brand_at IS NULL)
            )
        ) unread ON true

        ${whereSql}
        ORDER BY COALESCE(lm.created_at, t.updated_at) DESC
        `,
        [...values, isSupportUser(req)]
      );

      return res.json({ ok: true, data: rows });
    })
  );

  router.get(
    "/admin/support-chat/threads/:threadId/messages",
    authMiddleware,
    wrap(async (req, res) => {
      const { threadId } = req.params;

      if (!isUuid(threadId)) {
        return res.status(400).json({ ok: false, message: "Invalid threadId" });
      }

      const threadQ = await pool.query(
        `
        SELECT t.id, t.brand_id, b.slug as brand_slug
        FROM brand_support_threads t
        JOIN brands b ON b.id = t.brand_id
        WHERE t.id=$1
        LIMIT 1
        `,
        [threadId]
      );

      if (!threadQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Thread not found" });
      }

      const thread = threadQ.rows[0];

      if (!isSupportUser(req)) {
        const userBrandSlug = getBrandSlugFromUser(req);

        if (
          !userBrandSlug ||
          userBrandSlug !== String(thread.brand_slug).toLowerCase()
        ) {
          return res.status(403).json({ ok: false, message: "Forbidden" });
        }
      }

      if (isSupportUser(req)) {
        await pool.query(
          `
          UPDATE brand_support_messages
          SET read_by_support_at = NOW()
          WHERE thread_id=$1
            AND sender_type='BRAND'
            AND read_by_support_at IS NULL
          `,
          [threadId]
        );
      } else {
        await pool.query(
          `
          UPDATE brand_support_messages
          SET read_by_brand_at = NOW()
          WHERE thread_id=$1
            AND sender_type='SUPPORT'
            AND read_by_brand_at IS NULL
          `,
          [threadId]
        );
      }

      const { rows } = await pool.query(
        `
        SELECT
          id,
          thread_id as "threadId",
          brand_id as "brandId",
          sender_type as "senderType",
          sender_email as "senderEmail",
          original_language as "originalLanguage",
          translated_language as "translatedLanguage",
          original_text as "originalText",
          translated_text as "translatedText",
          read_by_support_at as "readBySupportAt",
          read_by_brand_at as "readByBrandAt",
          created_at as "createdAt"
        FROM brand_support_messages
        WHERE thread_id=$1
        ORDER BY created_at ASC
        `,
        [threadId]
      );

      return res.json({ ok: true, data: rows });
    })
  );

  router.post(
    "/admin/support-chat/threads/:threadId/messages",
    authMiddleware,
    wrap(async (req, res) => {
      const { threadId } = req.params;
      const { text } = req.body || {};

      if (!isUuid(threadId)) {
        return res.status(400).json({ ok: false, message: "Invalid threadId" });
      }

      if (!text || typeof text !== "string") {
        return res.status(400).json({ ok: false, message: "text is required" });
      }

      const threadQ = await pool.query(
        `
        SELECT t.id, t.brand_id, b.slug as brand_slug
        FROM brand_support_threads t
        JOIN brands b ON b.id = t.brand_id
        WHERE t.id=$1
        LIMIT 1
        `,
        [threadId]
      );

      if (!threadQ.rows.length) {
        return res.status(404).json({ ok: false, message: "Thread not found" });
      }

      const thread = threadQ.rows[0];

      let senderType = "SUPPORT";
      let sourceLanguage = "en";
      let targetLanguage = "de";

      if (!isSupportUser(req)) {
        const userBrandSlug = getBrandSlugFromUser(req);

        if (
          !userBrandSlug ||
          userBrandSlug !== String(thread.brand_slug).toLowerCase()
        ) {
          return res.status(403).json({ ok: false, message: "Forbidden" });
        }

        senderType = "BRAND";
        sourceLanguage = "de";
        targetLanguage = "en";
      }

      const translated = await translateText({
        text,
        from: sourceLanguage,
        to: targetLanguage,
      });

      const messageQ = await pool.query(
        `
        INSERT INTO brand_support_messages (
          thread_id,
          brand_id,
          sender_type,
          sender_email,
          original_language,
          translated_language,
          original_text,
          translated_text,
          read_by_support_at,
          read_by_brand_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING
          id,
          thread_id as "threadId",
          brand_id as "brandId",
          sender_type as "senderType",
          sender_email as "senderEmail",
          original_language as "originalLanguage",
          translated_language as "translatedLanguage",
          original_text as "originalText",
          translated_text as "translatedText",
          read_by_support_at as "readBySupportAt",
          read_by_brand_at as "readByBrandAt",
          created_at as "createdAt"
        `,
        [
          threadId,
          thread.brand_id,
          senderType,
          req.user?.email || null,
          translated.detectedLanguage,
          translated.translatedLanguage,
          translated.originalText,
          translated.translatedText,
          senderType === "SUPPORT" ? new Date() : null,
          senderType === "BRAND" ? new Date() : null,
        ]
      );

      await pool.query(
        `UPDATE brand_support_threads SET updated_at=NOW() WHERE id=$1`,
        [threadId]
      );

      return res.json({ ok: true, data: messageQ.rows[0] });
    })
  );

  router.get(
    "/admin/support-chat/notifications/count",
    authMiddleware,
    wrap(async (req, res) => {
      if (isSupportUser(req)) {
        const q = await pool.query(`
          SELECT COUNT(*)::int as count
          FROM brand_support_messages
          WHERE sender_type='BRAND'
            AND read_by_support_at IS NULL
        `);

        return res.json({ ok: true, data: { count: q.rows[0]?.count || 0 } });
      }

      const brand = await getBrandForUser(req);

      if (!brand) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      const q = await pool.query(
        `
        SELECT COUNT(*)::int as count
        FROM brand_support_messages
        WHERE brand_id=$1
          AND sender_type='SUPPORT'
          AND read_by_brand_at IS NULL
        `,
        [brand.id]
      );

      return res.json({ ok: true, data: { count: q.rows[0]?.count || 0 } });
    })
  );

  router.get(
    "/admin/support-chat/notifications",
    authMiddleware,
    wrap(async (req, res) => {
      const values = [];
      let whereSql = "";

      if (isSupportUser(req)) {
        whereSql = `
          m.sender_type='BRAND'
          AND m.read_by_support_at IS NULL
        `;
      } else {
        const brand = await getBrandForUser(req);

        if (!brand) {
          return res.status(403).json({ ok: false, message: "Forbidden" });
        }

        values.push(brand.id);

        whereSql = `
          m.brand_id=$1
          AND m.sender_type='SUPPORT'
          AND m.read_by_brand_at IS NULL
        `;
      }

      const q = await pool.query(
        `
        SELECT
          m.id,
          m.thread_id as "threadId",
          m.brand_id as "brandId",
          m.sender_type as "senderType",
          m.original_text as "originalText",
          m.translated_text as "translatedText",
          m.created_at as "createdAt",
          b.name as "brandName",
          b.slug as "brandSlug"
        FROM brand_support_messages m
        JOIN brands b ON b.id = m.brand_id
        WHERE ${whereSql}
        ORDER BY m.created_at DESC
        LIMIT 50
        `,
        values
      );

      return res.json({ ok: true, data: q.rows });
    })
  );

  return router;
}