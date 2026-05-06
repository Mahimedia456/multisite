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

  function isFullAdmin(req) {
    const role = String(req.user?.role || "").toLowerCase();
    const email = String(req.user?.email || "").toLowerCase();

    return (
      role === "admin" &&
      !email.includes("allianz3") &&
      !email.includes("allianz4")
    );
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
    if (isFullAdmin(req)) return true;

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

  async function resolveBrandIdForAdminList(req, brandId) {
    if (isFullAdmin(req)) {
      return isUuid(brandId) ? brandId : null;
    }

    const brand = await getUserBrand(req);
    return brand?.id || "__none__";
  }

  /* =========================
     ADMIN BLOG CATEGORIES
  ========================= */

  router.get(
    "/admin/blog-categories",
    authMiddleware,
    wrap(async (req, res) => {
      const brandId = await resolveBrandIdForAdminList(
        req,
        String(req.query.brandId || "")
      );

      if (brandId === "__none__") {
        return res.json({ ok: true, data: [] });
      }

      const qText = String(req.query.q || "").trim().toLowerCase();
      const vals = [];
      const where = [];

      if (brandId) {
        vals.push(brandId);
        where.push(`c.brand_id=$${vals.length}`);
      }

      if (qText) {
        vals.push(`%${qText}%`);
        const idx = vals.length;
        where.push(`
          (
            LOWER(COALESCE(c.name,'')) LIKE $${idx}
            OR LOWER(COALESCE(c.slug,'')) LIKE $${idx}
            OR LOWER(COALESCE(br.name,'')) LIKE $${idx}
            OR LOWER(COALESCE(br.slug,'')) LIKE $${idx}
          )
        `);
      }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const q = await pool.query(
        `
        SELECT
          c.*,
          br.name AS brand_name,
          br.slug AS brand_slug,
          (
            SELECT COUNT(*)::int
            FROM blogs b
            WHERE b.category_id = c.id
          ) AS blogs_count
        FROM blog_categories c
        JOIN brands br ON br.id=c.brand_id
        ${whereSql}
        ORDER BY c.updated_at DESC NULLS LAST, c.created_at DESC
        LIMIT 500
        `,
        vals
      );

      return res.json({ ok: true, data: q.rows });
    })
  );

  router.post(
    "/admin/blog-categories",
    authMiddleware,
    wrap(async (req, res) => {
      const body = req.body || {};
      let brandId = body.brandId || body.brand_id;

      const userBrand = await getUserBrand(req);
      if (userBrand) brandId = userBrand.id;

      if (!isUuid(brandId)) {
        return res
          .status(400)
          .json({ ok: false, message: "brandId is required" });
      }

      const allowed = await canUse(req, "create", brandId);
      if (!allowed) {
        return res
          .status(403)
          .json({ ok: false, message: "Create permission denied" });
      }

      const name = String(body.name || "").trim();

      if (!name) {
        return res
          .status(400)
          .json({ ok: false, message: "Category name is required" });
      }

      const q = await pool.query(
        `
        INSERT INTO blog_categories (
          brand_id,
          name,
          slug,
          description,
          is_hidden,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,NOW())
        RETURNING *
        `,
        [
          brandId,
          name,
          slugify(body.slug || name),
          body.description || "",
          Boolean(body.isHidden ?? body.is_hidden),
        ]
      );

      return res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.put(
    "/admin/blog-categories/:id",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid category id" });
      }

      const oldQ = await pool.query(
        `SELECT * FROM blog_categories WHERE id=$1 LIMIT 1`,
        [id]
      );

      const old = oldQ.rows[0];

      if (!old) {
        return res
          .status(404)
          .json({ ok: false, message: "Category not found" });
      }

      const allowed = await canUse(req, "edit", old.brand_id);
      if (!allowed) {
        return res
          .status(403)
          .json({ ok: false, message: "Edit permission denied" });
      }

      const body = req.body || {};
      const name = String(body.name ?? old.name).trim();

      const q = await pool.query(
        `
        UPDATE blog_categories
        SET
          name=$2,
          slug=$3,
          description=$4,
          is_hidden=$5,
          updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [
          id,
          name,
          slugify(body.slug ?? old.slug ?? name),
          body.description ?? old.description ?? "",
          Boolean(body.isHidden ?? body.is_hidden ?? old.is_hidden),
        ]
      );

      return res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.delete(
    "/admin/blog-categories/:id",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      if (!isUuid(id)) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid category id" });
      }

      const oldQ = await pool.query(
        `SELECT * FROM blog_categories WHERE id=$1 LIMIT 1`,
        [id]
      );

      const old = oldQ.rows[0];

      if (!old) {
        return res
          .status(404)
          .json({ ok: false, message: "Category not found" });
      }

      const allowed = await canUse(req, "delete", old.brand_id);
      if (!allowed) {
        return res
          .status(403)
          .json({ ok: false, message: "Delete permission denied" });
      }

      await pool.query(`UPDATE blogs SET category_id=NULL WHERE category_id=$1`, [
        id,
      ]);
      await pool.query(`DELETE FROM blog_categories WHERE id=$1`, [id]);

      return res.json({ ok: true, deleted: true });
    })
  );

  /* =========================
     ADMIN BLOGS
  ========================= */

  router.get(
    "/admin/blogs",
    authMiddleware,
    wrap(async (req, res) => {
      const qText = String(req.query.q || "").trim().toLowerCase();
      const status = String(req.query.status || "all").toLowerCase();
      const brandIdParam = String(req.query.brandId || "").trim();
      const categoryId = String(req.query.categoryId || "").trim();

      const brandId = await resolveBrandIdForAdminList(req, brandIdParam);

      if (brandId === "__none__") {
        return res.json({ ok: true, data: [] });
      }

      const where = [];
      const vals = [];

      if (brandId) {
        vals.push(brandId);
        where.push(`b.brand_id=$${vals.length}`);
      }

      if (status !== "all") {
        vals.push(status);
        where.push(`LOWER(COALESCE(b.status,''))=$${vals.length}`);
      }

      if (isUuid(categoryId)) {
        vals.push(categoryId);
        where.push(`b.category_id=$${vals.length}`);
      }

      if (qText) {
        vals.push(`%${qText}%`);
        const idx = vals.length;

        where.push(`
          (
            LOWER(COALESCE(b.title,'')) LIKE $${idx}
            OR LOWER(COALESCE(b.slug,'')) LIKE $${idx}
            OR LOWER(COALESCE(b.excerpt,'')) LIKE $${idx}
            OR LOWER(COALESCE(br.name,'')) LIKE $${idx}
            OR LOWER(COALESCE(br.slug,'')) LIKE $${idx}
            OR LOWER(COALESCE(c.name,'')) LIKE $${idx}
          )
        `);
      }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const q = await pool.query(
        `
        SELECT
          b.*,
          br.name AS brand_name,
          br.slug AS brand_slug,
          c.name AS category_name,
          c.slug AS category_slug
        FROM blogs b
        LEFT JOIN brands br ON br.id=b.brand_id
        LEFT JOIN blog_categories c ON c.id=b.category_id
        ${whereSql}
        ORDER BY b.updated_at DESC NULLS LAST, b.created_at DESC
        LIMIT 500
        `,
        vals
      );

      return res.json({ ok: true, data: q.rows });
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
        SELECT
          b.*,
          br.name AS brand_name,
          br.slug AS brand_slug,
          c.name AS category_name,
          c.slug AS category_slug
        FROM blogs b
        LEFT JOIN brands br ON br.id=b.brand_id
        LEFT JOIN blog_categories c ON c.id=b.category_id
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

      return res.json({ ok: true, data: blog });
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
        return res
          .status(400)
          .json({ ok: false, message: "brandId is required" });
      }

      const allowed = await canUse(req, "create", brandId);
      if (!allowed) {
        return res
          .status(403)
          .json({ ok: false, message: "Create permission denied" });
      }

      const title = String(body.title || "").trim();

      if (!title) {
        return res.status(400).json({ ok: false, message: "Title is required" });
      }

      const categoryId = body.categoryId || body.category_id || null;

      if (categoryId && !isUuid(categoryId)) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid category id" });
      }

      if (categoryId) {
        const categoryQ = await pool.query(
          `SELECT id FROM blog_categories WHERE id=$1 AND brand_id=$2 LIMIT 1`,
          [categoryId, brandId]
        );

        if (!categoryQ.rows.length) {
          return res.status(400).json({
            ok: false,
            message: "Category does not belong to selected brand",
          });
        }
      }

      const status = normalizeStatus(body.status);
      const slug = slugify(body.slug || title);
      const isHidden = Boolean(body.isHidden ?? body.is_hidden ?? status === "hidden");

      const q = await pool.query(
        `
        INSERT INTO blogs (
          brand_id,
          category_id,
          title,
          slug,
          excerpt,
          content,
          featured_image,
          author_name,
          status,
          is_hidden,
          seo_title,
          seo_description,
          seo_keywords,
          canonical_url,
          og_title,
          og_description,
          og_image,
          published_at,
          updated_at
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
          CASE WHEN $9='published' THEN NOW() ELSE NULL END,
          NOW()
        )
        RETURNING *
        `,
        [
          brandId,
          categoryId || null,
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

      return res.json({ ok: true, data: q.rows[0] });
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

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [
        id,
      ]);
      const old = oldQ.rows[0];

      if (!old) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "edit", old.brand_id);
      if (!allowed) {
        return res
          .status(403)
          .json({ ok: false, message: "Edit permission denied" });
      }

      const body = req.body || {};
      const status = normalizeStatus(body.status ?? old.status);
      const isHidden = Boolean(body.isHidden ?? body.is_hidden ?? status === "hidden");

      const categoryId = body.categoryId ?? body.category_id ?? old.category_id ?? null;

      if (categoryId && !isUuid(categoryId)) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid category id" });
      }

      if (categoryId) {
        const categoryQ = await pool.query(
          `SELECT id FROM blog_categories WHERE id=$1 AND brand_id=$2 LIMIT 1`,
          [categoryId, old.brand_id]
        );

        if (!categoryQ.rows.length) {
          return res.status(400).json({
            ok: false,
            message: "Category does not belong to selected brand",
          });
        }
      }

      const title = String(body.title ?? old.title).trim();

      const q = await pool.query(
        `
        UPDATE blogs
        SET
          category_id=$2,
          title=$3,
          slug=$4,
          excerpt=$5,
          content=$6,
          featured_image=$7,
          author_name=$8,
          status=$9,
          is_hidden=$10,
          seo_title=$11,
          seo_description=$12,
          seo_keywords=$13,
          canonical_url=$14,
          og_title=$15,
          og_description=$16,
          og_image=$17,
          published_at=CASE
            WHEN $9='published' AND published_at IS NULL THEN NOW()
            WHEN $9!='published' THEN NULL
            ELSE published_at
          END,
          updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [
          id,
          categoryId || null,
          title,
          slugify(body.slug ?? old.slug ?? title),
          body.excerpt ?? old.excerpt ?? "",
          body.content && typeof body.content === "object"
            ? body.content
            : old.content || {},
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

      return res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.patch(
    "/admin/blogs/:id/publish",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [
        id,
      ]);
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
        SET
          status='published',
          is_hidden=false,
          published_at=COALESCE(published_at, NOW()),
          updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [id]
      );

      return res.json({ ok: true, data: q.rows[0] });
    })
  );

  router.patch(
    "/admin/blogs/:id/hide",
    authMiddleware,
    wrap(async (req, res) => {
      const { id } = req.params;

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [
        id,
      ]);
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
        SET
          status='hidden',
          is_hidden=true,
          updated_at=NOW()
        WHERE id=$1
        RETURNING *
        `,
        [id]
      );

      return res.json({ ok: true, data: q.rows[0] });
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

      const oldQ = await pool.query(`SELECT * FROM blogs WHERE id=$1 LIMIT 1`, [
        id,
      ]);
      const old = oldQ.rows[0];

      if (!old) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const allowed = await canUse(req, "delete", old.brand_id);
      if (!allowed) {
        return res
          .status(403)
          .json({ ok: false, message: "Delete permission denied" });
      }

      await pool.query(`DELETE FROM blogs WHERE id=$1`, [id]);

      return res.json({ ok: true, deleted: true });
    })
  );

  /* =========================
     BLOG PERMISSIONS
  ========================= */

  router.get(
    "/admin/blog-module-permissions",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
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

      return res.json({ ok: true, data: q.rows });
    })
  );

  router.put(
    "/admin/blog-module-permissions/:brandId",
    authMiddleware,
    wrap(async (req, res) => {
      if (!isFullAdmin(req)) {
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
          brand_id,
          module_key,
          can_view,
          can_create,
          can_edit,
          can_delete,
          updated_at
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

      return res.json({ ok: true, data: q.rows[0] });
    })
  );

  /* =========================
     PUBLIC BLOGS
  ========================= */

  router.get(
    "/public/:brandSlug/blog-categories",
    wrap(async (req, res) => {
      const brandSlug = String(req.params.brandSlug || "").toLowerCase().trim();

      const q = await pool.query(
        `
        SELECT
          c.id,
          c.name,
          c.slug,
          c.description,
          (
            SELECT COUNT(*)::int
            FROM blogs b
            WHERE b.category_id=c.id
              AND b.status='published'
              AND b.is_hidden=false
          ) AS blogs_count
        FROM blog_categories c
        JOIN brands br ON br.id=c.brand_id
        JOIN brand_module_permissions p
          ON p.brand_id=br.id
          AND p.module_key='blogs'
          AND p.can_view=true
        WHERE LOWER(br.slug)=$1
          AND c.is_hidden=false
        ORDER BY c.name ASC
        `,
        [brandSlug]
      );

      return res.json({ ok: true, data: q.rows });
    })
  );
router.get(
  "/public/brands/:brandSlug/theme",
  wrap(async (req, res) => {
    try {
      const brandSlug = String(req.params.brandSlug || "")
        .toLowerCase()
        .trim();

      const q = await pool.query(
        `
        SELECT
          id,
          name,
          slug,
          website_url,
          accent_color,
          primary_color,
          primary_dark_color,
          accent_color_2,
          background_light,
          background_dark,
          surface_light,
          surface_dark,
          font_family,
          font_google_url,
          icon_font_url,
          logo_type,
          logo_value,
          logo_text,
          company_name,
          company_phone,
          company_whatsapp,
          company_email,
          company_location,
          support_email
        FROM brands
        WHERE LOWER(slug)=$1
        LIMIT 1
        `,
        [brandSlug]
      );

      const b = q.rows[0];

      if (!b) {
        return res
          .status(404)
          .json({ ok: false, message: "Brand not found" });
      }

      return res.json({
        ok: true,
        data: {
          brand: {
            id: b.id,
            name: b.name,
            slug: b.slug,

            websiteUrl: b.website_url || "",

            accentColor: b.accent_color || "",
            primaryColor: b.primary_color || "",
            primaryDarkColor: b.primary_dark_color || "",
            accentColor2: b.accent_color_2 || "",

            backgroundLight: b.background_light || "",
            backgroundDark: b.background_dark || "",

            surfaceLight: b.surface_light || "",
            surfaceDark: b.surface_dark || "",

            fontFamily: b.font_family || "",
            fontGoogleUrl: b.font_google_url || "",
            iconFontUrl: b.icon_font_url || "",

            logoType: b.logo_type || "material",
            logoValue: b.logo_value || "",
            logoText: b.logo_text || b.name || "",

            company: {
              name: b.company_name || "",
              phone: b.company_phone || "",
              whatsapp: b.company_whatsapp || "",
              email: b.company_email || "",
              location: b.company_location || "",
              supportEmail: b.support_email || "",
            },
          },
        },
      });
    } catch (e) {
      console.error("theme route error:", e);

      return res.status(500).json({
        ok: false,
        message: "Server error",
        error: e.message,
        code: e.code,
      });
    }
  })
);
  router.get(
    "/public/:brandSlug/blogs",
    wrap(async (req, res) => {
      const brandSlug = String(req.params.brandSlug || "").toLowerCase().trim();
      const search = String(req.query.search || req.query.q || "")
        .toLowerCase()
        .trim();
      const category = String(req.query.category || "").toLowerCase().trim();

      const vals = [brandSlug];
      const where = [
        `LOWER(br.slug)=$1`,
        `b.status='published'`,
        `b.is_hidden=false`,
        `p.can_view=true`,
      ];

      if (search) {
        vals.push(`%${search}%`);
        const idx = vals.length;

        where.push(`
          (
            LOWER(COALESCE(b.title,'')) LIKE $${idx}
            OR LOWER(COALESCE(b.excerpt,'')) LIKE $${idx}
            OR LOWER(COALESCE(c.name,'')) LIKE $${idx}
          )
        `);
      }

      if (category) {
        vals.push(category);
        where.push(`LOWER(COALESCE(c.slug,''))=$${vals.length}`);
      }

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
          br.slug AS brand_slug,
          c.name AS category_name,
          c.slug AS category_slug
        FROM blogs b
        JOIN brands br ON br.id=b.brand_id
        JOIN brand_module_permissions p
          ON p.brand_id=br.id
          AND p.module_key='blogs'
        LEFT JOIN blog_categories c ON c.id=b.category_id
        WHERE ${where.join(" AND ")}
        ORDER BY b.published_at DESC NULLS LAST, b.created_at DESC
        LIMIT 100
        `,
        vals
      );

      return res.json({ ok: true, data: q.rows });
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
          br.slug AS brand_slug,
          c.name AS category_name,
          c.slug AS category_slug
        FROM blogs b
        JOIN brands br ON br.id=b.brand_id
        JOIN brand_module_permissions p
          ON p.brand_id=br.id
          AND p.module_key='blogs'
          AND p.can_view=true
        LEFT JOIN blog_categories c ON c.id=b.category_id
        WHERE LOWER(br.slug)=$1
          AND LOWER(b.slug)=$2
          AND b.status='published'
          AND b.is_hidden=false
        LIMIT 1
        `,
        [brandSlug, slug]
      );

      const blog = q.rows[0];

      if (!blog) {
        return res.status(404).json({ ok: false, message: "Blog not found" });
      }

      const relatedQ = await pool.query(
        `
        SELECT
          b.id,
          b.title,
          b.slug,
          b.excerpt,
          b.featured_image,
          b.published_at,
          c.name AS category_name,
          c.slug AS category_slug
        FROM blogs b
        LEFT JOIN blog_categories c ON c.id=b.category_id
        WHERE b.brand_id=$1
          AND b.id<>$2
          AND b.status='published'
          AND b.is_hidden=false
          AND (
            $3::uuid IS NULL
            OR b.category_id=$3::uuid
          )
        ORDER BY b.published_at DESC NULLS LAST, b.created_at DESC
        LIMIT 3
        `,
        [blog.brand_id, blog.id, blog.category_id]
      );

      return res.json({
        ok: true,
        data: blog,
        related: relatedQ.rows,
      });
    })
  );

  return router;
}