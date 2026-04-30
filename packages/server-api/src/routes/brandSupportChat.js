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
          lm.translated_text as "lastMessage",
          lm.original_text as "lastOriginalMessage",
          lm.sender_type as "lastSenderType",
          lm.created_at as "lastMessageAt"
        FROM brand_support_threads t
        JOIN brands b ON b.id = t.brand_id
        LEFT JOIN LATERAL (
          SELECT translated_text, original_text, sender_type, created_at
          FROM brand_support_messages
          WHERE thread_id = t.id
          ORDER BY created_at DESC
          LIMIT 1
        ) lm ON true
        ${whereSql}
        ORDER BY t.updated_at DESC
        `,
        values
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
        targetLanguage = "en";
      }

      const translated = await translateText({
        text,
        from: "auto",
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
          translated_text
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
        ]
      );

      await pool.query(
        `UPDATE brand_support_threads SET updated_at=NOW() WHERE id=$1`,
        [threadId]
      );

      return res.json({ ok: true, data: messageQ.rows[0] });
    })
  );

  return router;
}