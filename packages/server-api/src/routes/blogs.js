import express from "express";

export default function blogsRoutes({ pool, authMiddleware, wrap, isUuid }) {
  const router = express.Router();

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 160);
  }

  function normalizeStatus(status) {
    const s = String(status || "draft").toLowerCase().trim();
    if (["published", "draft", "hidden"].includes(s)) return s;
    return "draft";
  }

  async function getUserBrand(req) {
    const email = String(req.user?.email || "").toLowerCase();

    let slug = "";
    if (email.includes("allianz3")) slug = "kundler3";
    if (email.includes("allianz4")) slug = "allianz4";

    if (!slug) return null;

    const q = await pool.query(
      `SELECT id, slug, name FROM brands WHERE LOWER(slug)=$1 LIMIT 1`,
      [slug]
    );

    return q.rows[0] || null;
  }

  async function canUse(req, action, brandId) {
    const role = String(req.user?.role || "").toLowerCase();
    const email = String(req.user?.email || "").toLowerCase();

    if (role === "admin" && !email.includes("allianz3") && !email.includes("allianz4")) {
      return true;
    }

    const brand = await getUserBrand(req);
    if (!brand || String(brand.id) !== String(brandId)) return false;

    const q = await pool.query(
      `
      SELECT can_view, can_create, can_edit, can_delete
      FROM brand_module_permissions
      WHERE brand_id=$1 AND module_key='blogs'
      LIMIT 1
      `,
      [brandId]
    );

    const p = q.rows[0];
    if (!p) return false;

    if (action === "view") return !!p.can_view;
    if (action === "create") return !!p.can_create;
    if (action === "edit") return !!p.can_edit;
    if (action === "delete") return !!p.can_delete;

    return false;
  }

  router.get(
    "/admin/blogs",
    authMiddleware,
    wrap(async (req, res) => {
      const qText = String(req.query.q || "").trim().toLowerCase();
      const status = String(req.query.status || "all").toLowerCase();
      const brandId = String(req.query.brandId || "").trim();

      const role = String(req.user?.role || "").toLowerCase();
      const email = String(req.user?.email || "").toLowerCase();

      const where = [];
      const vals = [];

      if (!(role === "admin" && !email.includes("allianz3") && !email.includes("allianz4"))) {
        const brand = await getUserBrand(req);
        if (!brand) return res.json({ ok: true, data: [] });

        const allowed = await canUse(req, "view", brand.id);
        if (!allowed) {
          return res.status(403).json({
            ok: false,
            message: "Blogs module is not enabled for this brand.",
          });
        }

        vals.push(brand.id);
        where.push(`b.brand_id=$${vals.length}`);
      } else if (isUuid(brandId)) {
        vals.push(brandId);
        where.push(`b.brand_id=$${vals.length}`);
      }

      if (status !== "all") {
        vals.push(status);
        where.push(`LOWER(COALESCE(b.status,''))=$${vals.length}`);
      }

      if (qText) {
        vals.push(`%${qText}%`);
        const idx = vals.length;
        where.push(`
          (
            LOWER(COALESCE(b.title,'')) LIKE $${idx}
            OR LOWER(COALESCE(b.slug,'')) LIKE $${idx}
            OR LOWER(COALESCE(br.name,'')) LIKE $${idx}
            OR LOWER(COALESCE(br.slug,'')) LIKE $${idx}
          )
        `);
      }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const q = await pool.query(
        `
        SELECT
          b.*,
          br.name AS brand_name,
          br.slug AS brand_slug
        FROM blogs b
        LEFT JOIN brands br ON br.id=b.brand_id
        ${whereSql}
        ORDER BY b.updated_at DESC NULLS LAST, b.created_at DESC
        LIMIT 500
        `,
        vals
      );

      res.json({ ok: true, data: q.rows });
    })
  );

  router.get(
    "/admin/blogs/:id",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid blog id" });
      }

      const q = await pool.query(
        `
        SELECT b.*, br.name AS brand_name, br.slug AS brand_slug
        FROM blogs b
        LEFT JOIN brands br ON br.id=b.brand_id
        WHERE b.id=$1
        LIMIT 1
        `,
        [id]
      );

      const blog = q.rows[0];
      if (!blog) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "view", blog.brand_id);
      if (!allowed) {
        return res.status(403).json({ ok: false, message: "Permission denied" });
      }

      res.json({ ok: true, data: blog });
    })
  );

  router.post(
    "/admin/blogs",
    authMiddleware,
    wrap(async (req, res) => {
      const body = req.body || {};
      let brandId = body.brandId || body.brand_id;

      const userBrand = await getUserBrand(req);
      if (userBrand) brandId = userBrand.id;

      if (!isUuid(brandId)) {
        return res.status(400).json({ ok: false, message: "brandId is required" });
      }

      const allowed = await canUse(req, "create", brandId);
      if (!allowed) {
        return res.status(403).json({ ok: false, message: "Create permission denied" });
      }

      const title = String(body.title || "").trim();
      if (!title) {
        return res.status(400).json({ ok: false, message: "Title is required" });
      }

      const status = normalizeStatus(body.status);
      const slug = slugify(body.slug || title);
      const isHidden = Boolean(body.isHidden ?? body.is_hidden ?? status === "hidden");

      const q = await pool.query(
        `
        INSERT INTO blogs (
          brand_id, title, slug, excerpt, content,
          featured_image, author_name,
          status, is_hidden,
          seo_title, seo_description, seo_keywords, canonical_url,
          og_title, og_description, og_image,
          published_at, updated_at
        )
        VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,
          $8,$9,
          $10,$11,$12,$13,
          $14,$15,$16,
          CASE WHEN $8='published' THEN NOW() ELSE NULL END,
          NOW()
        )
        RETURNING *
        `,
        [
          brandId,
          title,
          slug,
          body.excerpt || "",
          body.content && typeof body.content === "object" ? body.content : {},
          body.featuredImage || body.featured_image || "",
          body.authorName || body.author_name || "",
          status,
          isHidden,
          body.seoTitle || body.seo_title || "",
          body.seoDescription || body.seo_description || "",
          body.seoKeywords || body.seo_keywords || "",
          body.canonicalUrl || body.canonical_url || "",
          body.ogTitle || body.og_title || "",
          body.ogDescription || body.og_description || "",
          body.ogImage || body.og_image || "",
        ]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.put(
    "/admin/blogs/:id",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid blog id" });
      }

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [id]);
      const old = oldQ.rows[0];

      if (!old) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "edit", old.brand_id);
      if (!allowed) {
        return res.status(403).json({ ok: false, message: "Edit permission denied" });
      }

      const body = req.body || {};
      const status = normalizeStatus(body.status ?? old.status);
      const isHidden = Boolean(body.isHidden ?? body.is_hidden ?? status === "hidden");

      const q = await pool.query(
        `
        UPDATE blogs
        SET
          title=$2,
          slug=$3,
          excerpt=$4,
          content=$5,
          featured_image=$6,
          author_name=$7,
          status=$8,
          is_hidden=$9,
          seo_title=$10,
          seo_description=$11,
          seo_keywords=$12,
          canonical_url=$13,
          og_title=$14,
          og_description=$15,
          og_image=$16,
          published_at=CASE
            WHEN $8='published' AND published_at IS NULL THEN NOW()
            WHEN $8!='published' THEN NULL
            ELSE published_at
          END,
          updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [
          id,
          body.title ?? old.title,
          slugify(body.slug ?? old.slug ?? old.title),
          body.excerpt ?? old.excerpt ?? "",
          body.content && typeof body.content === "object" ? body.content : old.content || {},
          body.featuredImage ?? body.featured_image ?? old.featured_image ?? "",
          body.authorName ?? body.author_name ?? old.author_name ?? "",
          status,
          isHidden,
          body.seoTitle ?? body.seo_title ?? old.seo_title ?? "",
          body.seoDescription ?? body.seo_description ?? old.seo_description ?? "",
          body.seoKeywords ?? body.seo_keywords ?? old.seo_keywords ?? "",
          body.canonicalUrl ?? body.canonical_url ?? old.canonical_url ?? "",
          body.ogTitle ?? body.og_title ?? old.og_title ?? "",
          body.ogDescription ?? body.og_description ?? old.og_description ?? "",
          body.ogImage ?? body.og_image ?? old.og_image ?? "",
        ]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.patch(
    "/admin/blogs/:id/publish",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [id]);
      const old = oldQ.rows[0];

      if (!old) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "edit", old.brand_id);
      if (!allowed) {
        return res.status(403).json({ ok: false, message: "Permission denied" });
      }

      const q = await pool.query(
        `
        UPDATE blogs
        SET status='published',
            is_hidden=false,
            published_at=COALESCE(published_at, NOW()),
            updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [id]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.patch(
    "/admin/blogs/:id/hide",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [id]);
      const old = oldQ.rows[0];

      if (!old) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "edit", old.brand_id);
      if (!allowed) {
        return res.status(403).json({ ok: false, message: "Permission denied" });
      }

      const q = await pool.query(
        `
        UPDATE blogs
        SET status='hidden',
            is_hidden=true,
            updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [id]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.delete(
    "/admin/blogs/:id",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res.status(400).json({ ok: false, message: "Invalid blog id" });
      }

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [id]);
      const old = oldQ.rows[0];

      if (!old) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "delete", old.brand_id);
      if (!allowed) {
        return res.status(403).json({ ok: false, message: "Delete permission denied" });
      }

      await pool.query(`DELETE FROM blogs WHERE id=$1`, [id]);

      res.json({ ok: true, deleted: true });
    })
  );

  router.get(
    "/admin/blog-module-permissions",
    authMiddleware,
    wrap(async (req, res) => {
      const role = String(req.user?.role || "").toLowerCase();

      if (role !== "admin") {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const q = await pool.query(
        `
        SELECT
          br.id AS brand_id,
          br.name AS brand_name,
          br.slug AS brand_slug,
          COALESCE(p.can_view,false) AS can_view,
          COALESCE(p.can_create,false) AS can_create,
          COALESCE(p.can_edit,false) AS can_edit,
          COALESCE(p.can_delete,false) AS can_delete
        FROM brands br
        LEFT JOIN brand_module_permissions p
          ON p.brand_id=br.id AND p.module_key='blogs'
        ORDER BY br.name ASC
        `
      );

      res.json({ ok: true, data: q.rows });
    })
  );

  router.put(
    "/admin/blog-module-permissions/:brandId",
    authMiddleware,
    wrap(async (req, res) => {
      const role = String(req.user?.role || "").toLowerCase();

      if (role !== "admin") {
        return res.status(403).json({ ok: false, message: "Admin only" });
      }

      const { brandId } = req.params;

      if (!isUuid(brandId)) {
        return res.status(400).json({ ok: false, message: "Invalid brand id" });
      }

      const body = req.body || {};

      const q = await pool.query(
        `
        INSERT INTO brand_module_permissions (
          brand_id, module_key, can_view, can_create, can_edit, can_delete, updated_at
        )
        VALUES ($1,'blogs',$2,$3,$4,$5,NOW())
        ON CONFLICT (brand_id, module_key)
        DO UPDATE SET
          can_view=EXCLUDED.can_view,
          can_create=EXCLUDED.can_create,
          can_edit=EXCLUDED.can_edit,
          can_delete=EXCLUDED.can_delete,
          updated_at=NOW()
        RETURNING *
        `,
        [
          brandId,
          Boolean(body.can_view ?? body.canView),
          Boolean(body.can_create ?? body.canCreate),
          Boolean(body.can_edit ?? body.canEdit),
          Boolean(body.can_delete ?? body.canDelete),
        ]
      );

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.get(
    "/public/:brandSlug/blogs",
    wrap(async (req, res) => {
      const brandSlug = String(req.params.brandSlug || "").toLowerCase().trim();

      const q = await pool.query(
        `
        SELECT
          b.id,
          b.title,
          b.slug,
          b.excerpt,
          b.featured_image,
          b.author_name,
          b.status,
          b.seo_title,
          b.seo_description,
          b.published_at,
          b.created_at,
          b.updated_at,
          br.name AS brand_name,
          br.slug AS brand_slug
        FROM blogs b
        JOIN brands br ON br.id=b.brand_id
        JOIN brand_module_permissions p
          ON p.brand_id=br.id
          AND p.module_key='blogs'
          AND p.can_view=true
        WHERE LOWER(br.slug)=$1
          AND b.status='published'
          AND b.is_hidden=false
        ORDER BY b.published_at DESC NULLS LAST, b.created_at DESC
        LIMIT 100
        `,
        [brandSlug]
      );

      res.json({ ok: true, data: q.rows });
    })
  );

  router.get(
    "/public/:brandSlug/blogs/:slug",
    wrap(async (req, res) => {
      const brandSlug = String(req.params.brandSlug || "").toLowerCase().trim();
      const slug = String(req.params.slug || "").toLowerCase().trim();

      const q = await pool.query(
        `
        SELECT
          b.*,
          br.name AS brand_name,
          br.slug AS brand_slug
        FROM blogs b
        JOIN brands br ON br.id=b.brand_id
        JOIN brand_module_permissions p
          ON p.brand_id=br.id
          AND p.module_key='blogs'
          AND p.can_view=true
        WHERE LOWER(br.slug)=$1
          AND LOWER(b.slug)=$2
          AND b.status='published'
          AND b.is_hidden=false
        LIMIT 1
        `,
        [brandSlug, slug]
      );

      if (!q.rows.length) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      res.json({ ok: true, data: q.rows[0] });
    })
  );

  return router;
}