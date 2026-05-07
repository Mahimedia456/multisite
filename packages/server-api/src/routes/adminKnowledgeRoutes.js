import express from "express";
import nodemailer from "nodemailer";

const EMAIL_TO = "aamir@mahimediasolutions.com";

function cleanText(value) {
  return String(value || "").trim();
}

function cleanSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}

export default function adminKnowledgeRoutes({ pool, authMiddleware, wrap }) {
  const router = express.Router();

  router.use(authMiddleware);

  /**
   * CATEGORIES
   */
  router.get(
    "/admin/knowledge/categories",
    wrap(async (req, res) => {
      const { rows } = await pool.query(`
        select *
        from knowledge_categories
        order by sort_order asc, title_de asc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.post(
    "/admin/knowledge/categories",
    wrap(async (req, res) => {
      const body = req.body || {};

      const titleDe = cleanText(body.title_de);
      const slug = cleanSlug(body.slug || titleDe);

      if (!titleDe) {
        return res.status(400).json({
          ok: false,
          message: "title_de is required",
        });
      }

      if (!slug) {
        return res.status(400).json({
          ok: false,
          message: "slug is required",
        });
      }

      const { rows } = await pool.query(
        `
        insert into knowledge_categories (
          title_de,
          title_en,
          slug,
          description_de,
          description_en,
          type,
          status,
          sort_order
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8)
        returning *
        `,
        [
          titleDe,
          cleanText(body.title_en),
          slug,
          cleanText(body.description_de),
          cleanText(body.description_en),
          cleanText(body.type) || "both",
          cleanText(body.status) || "active",
          Number(body.sort_order || 0),
        ]
      );

      res.json({ ok: true, data: rows[0] });
    })
  );

  router.put(
    "/admin/knowledge/categories/:id",
    wrap(async (req, res) => {
      const { id } = req.params;
      const body = req.body || {};

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid category id" });
      }

      const titleDe = cleanText(body.title_de);
      const slug = cleanSlug(body.slug || titleDe);

      if (!titleDe) {
        return res.status(400).json({
          ok: false,
          message: "title_de is required",
        });
      }

      const { rows } = await pool.query(
        `
        update knowledge_categories
        set
          title_de = $1,
          title_en = $2,
          slug = $3,
          description_de = $4,
          description_en = $5,
          type = $6,
          status = $7,
          sort_order = $8,
          updated_at = now()
        where id = $9
        returning *
        `,
        [
          titleDe,
          cleanText(body.title_en),
          slug,
          cleanText(body.description_de),
          cleanText(body.description_en),
          cleanText(body.type) || "both",
          cleanText(body.status) || "active",
          Number(body.sort_order || 0),
          id,
        ]
      );

      res.json({ ok: true, data: rows[0] || null });
    })
  );
  function getMailer() {
  if (!process.env.SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendKnowledgeSubmissionEmail({ submission, brand, form }) {
  const mailer = getMailer();

  if (!mailer) {
    return false;
  }

  const data = submission.data_json || {};

  const rows = Object.entries(data)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${escapeHtml(
            key
          )}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: EMAIL_TO,
    subject: `New Knowledge Form Submission - ${brand?.name || brand?.slug || "Brand"}`,
    html: `
      <h2>New Form Submission</h2>
      <p><strong>Brand:</strong> ${escapeHtml(brand?.name || brand?.slug || "-")}</p>
      <p><strong>Form:</strong> ${escapeHtml(form?.title_de || form?.title_en || "-")}</p>
      <p><strong>Name:</strong> ${escapeHtml(submission.full_name || "-")}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email || "-")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(submission.phone || "-")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(submission.subject || "-")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(submission.message || "-")}</p>

      <h3>Submitted Data</h3>
      <table style="border-collapse:collapse;width:100%;">
        ${rows}
      </table>
    `,
  });

  return true;
}

  router.delete(
    "/admin/knowledge/categories/:id",
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid category id" });
      }

      await pool.query(`delete from knowledge_categories where id = $1`, [id]);

      res.json({ ok: true });
    })
  );

  /**
   * ARTICLES
   */
  router.get(
    "/admin/knowledge/articles",
    wrap(async (req, res) => {
      const { rows } = await pool.query(`
        select
          a.*,
          c.title_de as category_title_de,
          c.title_en as category_title_en
        from knowledge_articles a
        left join knowledge_categories c on c.id = a.category_id
        order by a.sort_order asc, a.created_at desc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.post(
    "/admin/knowledge/articles",
    wrap(async (req, res) => {
      const body = req.body || {};

      const titleDe = cleanText(body.title_de);
      const slug = cleanSlug(body.slug || titleDe);

      if (!titleDe) {
        return res.status(400).json({
          ok: false,
          message: "title_de is required",
        });
      }

      if (!slug) {
        return res.status(400).json({
          ok: false,
          message: "slug is required",
        });
      }

      const categoryId = isUuid(body.category_id) ? body.category_id : null;

      const { rows } = await pool.query(
        `
        insert into knowledge_articles (
          category_id,
          title_de,
          title_en,
          slug,
          excerpt_de,
          excerpt_en,
          content_de,
          content_en,
          status,
          is_shared,
          sort_order
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        returning *
        `,
        [
          categoryId,
          titleDe,
          cleanText(body.title_en),
          slug,
          cleanText(body.excerpt_de),
          cleanText(body.excerpt_en),
          cleanText(body.content_de),
          cleanText(body.content_en),
          cleanText(body.status) || "draft",
          body.is_shared === false ? false : true,
          Number(body.sort_order || 0),
        ]
      );

      res.json({ ok: true, data: rows[0] });
    })
  );

  router.put(
    "/admin/knowledge/articles/:id",
    wrap(async (req, res) => {
      const { id } = req.params;
      const body = req.body || {};

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid article id" });
      }

      const titleDe = cleanText(body.title_de);
      const slug = cleanSlug(body.slug || titleDe);
      const categoryId = isUuid(body.category_id) ? body.category_id : null;

      if (!titleDe) {
        return res.status(400).json({
          ok: false,
          message: "title_de is required",
        });
      }

      const { rows } = await pool.query(
        `
        update knowledge_articles
        set
          category_id = $1,
          title_de = $2,
          title_en = $3,
          slug = $4,
          excerpt_de = $5,
          excerpt_en = $6,
          content_de = $7,
          content_en = $8,
          status = $9,
          is_shared = $10,
          sort_order = $11,
          updated_at = now()
        where id = $12
        returning *
        `,
        [
          categoryId,
          titleDe,
          cleanText(body.title_en),
          slug,
          cleanText(body.excerpt_de),
          cleanText(body.excerpt_en),
          cleanText(body.content_de),
          cleanText(body.content_en),
          cleanText(body.status) || "draft",
          body.is_shared === false ? false : true,
          Number(body.sort_order || 0),
          id,
        ]
      );

      res.json({ ok: true, data: rows[0] || null });
    })
  );

  router.delete(
    "/admin/knowledge/articles/:id",
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid article id" });
      }

      await pool.query(`delete from knowledge_articles where id = $1`, [id]);

      res.json({ ok: true });
    })
  );

  /**
   * FAQS
   */
  router.get(
    "/admin/knowledge/faqs",
    wrap(async (req, res) => {
      const { rows } = await pool.query(`
        select
          f.*,
          c.title_de as category_title_de,
          c.title_en as category_title_en
        from knowledge_faqs f
        left join knowledge_categories c on c.id = f.category_id
        order by f.sort_order asc, f.created_at desc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.post(
    "/admin/knowledge/faqs",
    wrap(async (req, res) => {
      const body = req.body || {};

      const questionDe = cleanText(body.question_de);
      const answerDe = cleanText(body.answer_de);
      const categoryId = isUuid(body.category_id) ? body.category_id : null;

      if (!questionDe) {
        return res.status(400).json({
          ok: false,
          message: "question_de is required",
        });
      }

      if (!answerDe) {
        return res.status(400).json({
          ok: false,
          message: "answer_de is required",
        });
      }

      const { rows } = await pool.query(
        `
        insert into knowledge_faqs (
          category_id,
          question_de,
          question_en,
          answer_de,
          answer_en,
          status,
          sort_order
        )
        values ($1,$2,$3,$4,$5,$6,$7)
        returning *
        `,
        [
          categoryId,
          questionDe,
          cleanText(body.question_en),
          answerDe,
          cleanText(body.answer_en),
          cleanText(body.status) || "active",
          Number(body.sort_order || 0),
        ]
      );

      res.json({ ok: true, data: rows[0] });
    })
  );

  router.put(
    "/admin/knowledge/faqs/:id",
    wrap(async (req, res) => {
      const { id } = req.params;
      const body = req.body || {};

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid faq id" });
      }

      const questionDe = cleanText(body.question_de);
      const answerDe = cleanText(body.answer_de);
      const categoryId = isUuid(body.category_id) ? body.category_id : null;

      if (!questionDe) {
        return res.status(400).json({
          ok: false,
          message: "question_de is required",
        });
      }

      if (!answerDe) {
        return res.status(400).json({
          ok: false,
          message: "answer_de is required",
        });
      }

      const { rows } = await pool.query(
        `
        update knowledge_faqs
        set
          category_id = $1,
          question_de = $2,
          question_en = $3,
          answer_de = $4,
          answer_en = $5,
          status = $6,
          sort_order = $7,
          updated_at = now()
        where id = $8
        returning *
        `,
        [
          categoryId,
          questionDe,
          cleanText(body.question_en),
          answerDe,
          cleanText(body.answer_en),
          cleanText(body.status) || "active",
          Number(body.sort_order || 0),
          id,
        ]
      );

      res.json({ ok: true, data: rows[0] || null });
    })
  );

  router.delete(
    "/admin/knowledge/faqs/:id",
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid faq id" });
      }

      await pool.query(`delete from knowledge_faqs where id = $1`, [id]);

      res.json({ ok: true });
    })
  );

  /**
   * FORMS
   */
  router.get(
    "/admin/knowledge/forms",
    wrap(async (req, res) => {
      const { rows } = await pool.query(`
        select *
        from knowledge_forms
        order by sort_order asc, title_de asc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.post(
    "/admin/knowledge/forms",
    wrap(async (req, res) => {
      const body = req.body || {};

      const titleDe = cleanText(body.title_de);
      const slug = cleanSlug(body.slug || titleDe);
      const fields = Array.isArray(body.fields_json) ? body.fields_json : [];

      if (!titleDe) {
        return res.status(400).json({
          ok: false,
          message: "title_de is required",
        });
      }

      if (!slug) {
        return res.status(400).json({
          ok: false,
          message: "slug is required",
        });
      }

      const { rows } = await pool.query(
        `
        insert into knowledge_forms (
          title_de,
          title_en,
          slug,
          type,
          fields_json,
          success_message_de,
          success_message_en,
          status,
          sort_order
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        returning *
        `,
        [
          titleDe,
          cleanText(body.title_en),
          slug,
          cleanText(body.type) || "support",
          JSON.stringify(fields),
          cleanText(body.success_message_de),
          cleanText(body.success_message_en),
          cleanText(body.status) || "active",
          Number(body.sort_order || 0),
        ]
      );

      res.json({ ok: true, data: rows[0] });
    })
  );

  router.put(
    "/admin/knowledge/forms/:id",
    wrap(async (req, res) => {
      const { id } = req.params;
      const body = req.body || {};

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid form id" });
      }

      const titleDe = cleanText(body.title_de);
      const slug = cleanSlug(body.slug || titleDe);
      const fields = Array.isArray(body.fields_json) ? body.fields_json : [];

      if (!titleDe) {
        return res.status(400).json({
          ok: false,
          message: "title_de is required",
        });
      }

      const { rows } = await pool.query(
        `
        update knowledge_forms
        set
          title_de = $1,
          title_en = $2,
          slug = $3,
          type = $4,
          fields_json = $5,
          success_message_de = $6,
          success_message_en = $7,
          status = $8,
          sort_order = $9,
          updated_at = now()
        where id = $10
        returning *
        `,
        [
          titleDe,
          cleanText(body.title_en),
          slug,
          cleanText(body.type) || "support",
          JSON.stringify(fields),
          cleanText(body.success_message_de),
          cleanText(body.success_message_en),
          cleanText(body.status) || "active",
          Number(body.sort_order || 0),
          id,
        ]
      );

      res.json({ ok: true, data: rows[0] || null });
    })
  );

  router.delete(
    "/admin/knowledge/forms/:id",
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid form id" });
      }

      await pool.query(`delete from knowledge_forms where id = $1`, [id]);

      res.json({ ok: true });
    })
  );

  /**
   * SUBMISSIONS
   */
  router.get(
    "/admin/knowledge/submissions",
    wrap(async (req, res) => {
      const { rows } = await pool.query(`
        select
          s.*,
          b.name as brand_name,
          b.slug as brand_slug,
          f.title_de as form_title_de,
          f.title_en as form_title_en
        from knowledge_form_submissions s
        left join brands b on b.id = s.brand_id
        left join knowledge_forms f on f.id = s.form_id
        order by s.created_at desc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.put(
    "/admin/knowledge/submissions/:id/status",
    wrap(async (req, res) => {
      const { id } = req.params;
      const status = cleanText(req.body?.status) || "new";

      if (!isUuid(id)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid submission id",
        });
      }

      if (!["new", "in_progress", "resolved"].includes(status)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid status",
        });
      }

      const { rows } = await pool.query(
        `
        update knowledge_form_submissions
        set status = $1, updated_at = now()
        where id = $2
        returning *
        `,
        [status, id]
      );

      res.json({ ok: true, data: rows[0] || null });
    })
  );

  /**
   * SETTINGS
   */
  router.get(
    "/admin/knowledge/settings",
    wrap(async (req, res) => {
      const { rows } = await pool.query(`
        select
          b.id as brand_id,
          b.name as brand_name,
          b.slug as brand_slug,
          coalesce(s.knowledge_enabled, false) as knowledge_enabled,
          coalesce(s.articles_enabled, true) as articles_enabled,
          coalesce(s.faqs_enabled, true) as faqs_enabled,
          coalesce(s.forms_enabled, true) as forms_enabled,
          coalesce(s.show_in_header, false) as show_in_header,
          coalesce(s.show_in_footer, true) as show_in_footer
        from brands b
        left join brand_knowledge_settings s on s.brand_id = b.id
        order by b.name asc
      `);

      res.json({ ok: true, data: rows });
    })
  );

  router.put(
    "/admin/knowledge/settings/:brandId",
    wrap(async (req, res) => {
      const { brandId } = req.params;
      const body = req.body || {};

      if (!isUuid(brandId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid brand id",
        });
      }

      const values = {
        knowledge_enabled: Boolean(body.knowledge_enabled),
        articles_enabled: body.articles_enabled !== false,
        faqs_enabled: body.faqs_enabled !== false,
        forms_enabled: body.forms_enabled !== false,
        show_in_header: Boolean(body.show_in_header),
        show_in_footer: body.show_in_footer !== false,
      };

      const { rows } = await pool.query(
        `
        insert into brand_knowledge_settings (
          brand_id,
          knowledge_enabled,
          articles_enabled,
          faqs_enabled,
          forms_enabled,
          show_in_header,
          show_in_footer
        )
        values ($1,$2,$3,$4,$5,$6,$7)
        on conflict (brand_id)
        do update set
          knowledge_enabled = excluded.knowledge_enabled,
          articles_enabled = excluded.articles_enabled,
          faqs_enabled = excluded.faqs_enabled,
          forms_enabled = excluded.forms_enabled,
          show_in_header = excluded.show_in_header,
          show_in_footer = excluded.show_in_footer,
          updated_at = now()
        returning *
        `,
        [
          brandId,
          values.knowledge_enabled,
          values.articles_enabled,
          values.faqs_enabled,
          values.forms_enabled,
          values.show_in_header,
          values.show_in_footer,
        ]
      );

      res.json({ ok: true, data: rows[0] });
    })
  );

  /**
 * PUBLIC KNOWLEDGE AREA
 */

router.get(
  "/public/:brandSlug/knowledge",
  wrap(async (req, res) => {
    const { brandSlug } = req.params;

    const brandRes = await pool.query(
      `
      select b.*, s.*
      from brands b
      left join brand_knowledge_settings s on s.brand_id = b.id
      where b.slug = $1
      limit 1
      `,
      [brandSlug]
    );

    const brand = brandRes.rows[0];

    if (!brand || !brand.knowledge_enabled) {
      return res.status(404).json({
        ok: false,
        message: "Knowledge area not enabled",
      });
    }

    const [categories, articles, faqs, forms] = await Promise.all([
      pool.query(
        `
        select *
        from knowledge_categories
        where status = 'active'
        order by sort_order asc, title_de asc
        `
      ),
      pool.query(
        `
        select *
        from knowledge_articles
        where status = 'published'
        order by sort_order asc, created_at desc
        `
      ),
      pool.query(
        `
        select *
        from knowledge_faqs
        where status = 'active'
        order by sort_order asc, created_at desc
        `
      ),
      pool.query(
        `
        select *
        from knowledge_forms
        where status = 'active'
        order by sort_order asc, title_de asc
        `
      ),
    ]);

    res.json({
      ok: true,
      data: {
        brand,
        settings: {
          knowledge_enabled: brand.knowledge_enabled,
          articles_enabled: brand.articles_enabled,
          faqs_enabled: brand.faqs_enabled,
          forms_enabled: brand.forms_enabled,
          show_in_header: brand.show_in_header,
          show_in_footer: brand.show_in_footer,
        },
        categories: categories.rows,
        articles: brand.articles_enabled ? articles.rows : [],
        faqs: brand.faqs_enabled ? faqs.rows : [],
        forms: brand.forms_enabled ? forms.rows : [],
      },
    });
  })
);

router.get(
  "/public/:brandSlug/knowledge/articles/:slug",
  wrap(async (req, res) => {
    const { brandSlug, slug } = req.params;

    const { rows } = await pool.query(
      `
      select
        a.*,
        c.title_de as category_title_de,
        c.title_en as category_title_en
      from knowledge_articles a
      left join knowledge_categories c on c.id = a.category_id
      join brands b on b.slug = $1
      left join brand_knowledge_settings s on s.brand_id = b.id
      where a.slug = $2
        and a.status = 'published'
        and coalesce(s.knowledge_enabled, false) = true
        and coalesce(s.articles_enabled, true) = true
      limit 1
      `,
      [brandSlug, slug]
    );

    if (!rows[0]) {
      return res.status(404).json({
        ok: false,
        message: "Article not found",
      });
    }

    res.json({ ok: true, data: rows[0] });
  })
);

router.get(
  "/public/:brandSlug/knowledge/forms/:slug",
  wrap(async (req, res) => {
    const { brandSlug, slug } = req.params;

    const { rows } = await pool.query(
      `
      select f.*
      from knowledge_forms f
      join brands b on b.slug = $1
      left join brand_knowledge_settings s on s.brand_id = b.id
      where f.slug = $2
        and f.status = 'active'
        and coalesce(s.knowledge_enabled, false) = true
        and coalesce(s.forms_enabled, true) = true
      limit 1
      `,
      [brandSlug, slug]
    );

    if (!rows[0]) {
      return res.status(404).json({
        ok: false,
        message: "Form not found",
      });
    }

    res.json({ ok: true, data: rows[0] });
  })
);

router.post(
  "/public/:brandSlug/knowledge/forms/:slug/submit",
  wrap(async (req, res) => {
    const { brandSlug, slug } = req.params;
    const body = req.body || {};
    const data = body.data || body.data_json || {};

    const brandResult = await pool.query(
      `
      select
        b.*,
        coalesce(s.knowledge_enabled, false) as knowledge_enabled,
        coalesce(s.forms_enabled, true) as forms_enabled
      from brands b
      left join brand_knowledge_settings s on s.brand_id = b.id
      where b.slug = $1
      limit 1
      `,
      [brandSlug]
    );

    const brand = brandResult.rows[0];

    if (!brand || !brand.knowledge_enabled || !brand.forms_enabled) {
      return res.status(404).json({
        ok: false,
        message: "Knowledge form not available",
      });
    }

    const formResult = await pool.query(
      `
      select *
      from knowledge_forms
      where slug = $1
        and status = 'active'
      limit 1
      `,
      [slug]
    );

    const form = formResult.rows[0];

    if (!form) {
      return res.status(404).json({
        ok: false,
        message: "Form not found",
      });
    }

    const fullName =
      cleanText(body.full_name) ||
      cleanText(data.full_name) ||
      cleanText(data.name);

    const email =
      cleanText(body.email) ||
      cleanText(data.email) ||
      cleanText(data["e-mail"]);

    const phone =
      cleanText(body.phone) ||
      cleanText(data.phone) ||
      cleanText(data.telefon);

    const subject =
      cleanText(body.subject) ||
      cleanText(data.subject) ||
      cleanText(data.betreff) ||
      form.title_de;

    const message =
      cleanText(body.message) ||
      cleanText(data.message) ||
      cleanText(data.nachricht);

    const insertResult = await pool.query(
      `
      insert into knowledge_form_submissions (
        brand_id,
        form_id,
        full_name,
        email,
        phone,
        subject,
        message,
        data_json,
        status,
        email_sent,
        email_to
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,'new',false,$9)
      returning *
      `,
      [
        brand.id,
        form.id,
        fullName,
        email,
        phone,
        subject,
        message,
        JSON.stringify(data),
        EMAIL_TO,
      ]
    );

    let submission = insertResult.rows[0];
    let emailSent = false;

    try {
      emailSent = await sendKnowledgeSubmissionEmail({
        submission,
        brand,
        form,
      });

      if (emailSent) {
        const updateResult = await pool.query(
          `
          update knowledge_form_submissions
          set email_sent = true, updated_at = now()
          where id = $1
          returning *
          `,
          [submission.id]
        );

        submission = updateResult.rows[0] || submission;
      }
    } catch (emailError) {
      console.error("[knowledge form email failed]", emailError);
    }

    res.json({
      ok: true,
      data: submission,
      email_sent: emailSent,
      message:
        form.success_message_de ||
        "Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.",
    });
  })
);

  return router;
}