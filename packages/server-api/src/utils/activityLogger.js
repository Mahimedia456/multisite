import { sendActivityNotificationEmail } from "./mailer.js";

export function getActorFromReq(req = {}) {
  return {
    actorId: req.user?.id || req.user?.user?.id || null,
    actorEmail: String(
      req.user?.email ||
        req.user?.user?.email ||
        req.user?.admin?.email ||
        req.user?.admin_email ||
        ""
    ).toLowerCase(),
    actorRole: String(
      req.user?.role ||
        req.user?.user?.role ||
        req.user?.admin?.role ||
        ""
    ).toLowerCase(),
  };
}

export async function logActivity(pool, payload = {}) {
  const {
    brandId = null,
    brandSlug = null,
    brandName = null,

    actorId = null,
    actorEmail = null,
    actorRole = null,

    moduleKey,
    moduleLabel,

    action,
    title,
    description = "",

    entityType = null,
    entityId = null,
    entitySlug = null,

    oldData = {},
    newData = {},
    meta = {},

    notifyEmail = false,
  } = payload;

  if (!moduleKey || !moduleLabel || !action || !title) {
    console.warn("logActivity skipped: missing required fields", {
      moduleKey,
      moduleLabel,
      action,
      title,
    });
    return null;
  }

  const result = await pool.query(
    `
    INSERT INTO activity_logs (
      brand_id,
      brand_slug,
      brand_name,
      actor_id,
      actor_email,
      actor_role,
      module_key,
      module_label,
      action,
      title,
      description,
      entity_type,
      entity_id,
      entity_slug,
      old_data,
      new_data,
      meta,
      notify_email
    )
    VALUES (
      $1,$2,$3,
      $4,$5,$6,
      $7,$8,$9,$10,$11,
      $12,$13,$14,
      $15::jsonb,$16::jsonb,$17::jsonb,
      $18
    )
    RETURNING *
    `,
    [
      brandId,
      brandSlug,
      brandName,
      actorId,
      actorEmail,
      actorRole,
      moduleKey,
      moduleLabel,
      action,
      title,
      description,
      entityType,
      entityId,
      entitySlug,
      JSON.stringify(oldData || {}),
      JSON.stringify(newData || {}),
      JSON.stringify(meta || {}),
      Boolean(notifyEmail),
    ]
  );

  const saved = result.rows[0] || null;

  if (!saved) return null;

  if (notifyEmail) {
    try {
      const emailResult = await sendActivityNotificationEmail(saved);

      if (emailResult?.ok) {
        await pool.query(
          `
          UPDATE activity_logs
          SET
            email_sent = true,
            email_sent_at = NOW(),
            meta = COALESCE(meta, '{}'::jsonb) || $2::jsonb
          WHERE id = $1
          `,
          [
            saved.id,
            JSON.stringify({
              email: {
                messageId: emailResult.messageId || null,
                accepted: emailResult.accepted || [],
                rejected: emailResult.rejected || [],
              },
            }),
          ]
        );

        saved.email_sent = true;
      } else {
        await pool.query(
          `
          UPDATE activity_logs
          SET meta = COALESCE(meta, '{}'::jsonb) || $2::jsonb
          WHERE id = $1
          `,
          [
            saved.id,
            JSON.stringify({
              email: {
                skipped: true,
                message: emailResult?.message || "Email skipped",
              },
            }),
          ]
        );
      }
    } catch (error) {
      console.error("Activity email send failed:", error?.message);

      await pool.query(
        `
        UPDATE activity_logs
        SET meta = COALESCE(meta, '{}'::jsonb) || $2::jsonb
        WHERE id = $1
        `,
        [
          saved.id,
          JSON.stringify({
            email: {
              failed: true,
              message: error?.message || "Email failed",
            },
          }),
        ]
      );
    }
  }

  return saved;
}