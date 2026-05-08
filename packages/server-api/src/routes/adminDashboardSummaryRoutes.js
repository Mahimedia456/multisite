import express from "express";

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

function getForcedBrandSlug(req) {
  const email = getUserEmail(req);

  if (email.includes("allianz3")) return "kundler3";
  if (email.includes("allianz4")) return "allianz4";

  return "";
}

function isBrandUser(req) {
  const role = getReqRole(req);
  const forcedSlug = getForcedBrandSlug(req);

  return Boolean(forcedSlug) || role.includes("brand");
}

async function countSafe(pool, sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return Number(result.rows?.[0]?.count || 0);
  } catch (error) {
    console.warn("dashboard-summary count failed:", error?.message);
    return 0;
  }
}

async function oneRowSafe(pool, sql, params = [], fallback = {}) {
  try {
    const result = await pool.query(sql, params);
    return result.rows?.[0] || fallback;
  } catch (error) {
    console.warn("dashboard-summary row failed:", error?.message);
    return fallback;
  }
}

async function manyRowsSafe(pool, sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows || [];
  } catch (error) {
    console.warn("dashboard-summary rows failed:", error?.message);
    return [];
  }
}

function makeBrandFilter({ forcedSlug }) {
  const values = [];
  const where = [];

  if (forcedSlug) {
    values.push(forcedSlug);
    where.push(`LOWER(COALESCE(slug,'')) = $${values.length}`);
  }

  return {
    values,
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
  };
}

function makeBrandIdFilter(brandIds) {
  if (!brandIds.length) {
    return {
      sql: "",
      params: [],
    };
  }

  return {
    sql: "AND brand_id = ANY($1::uuid[])",
    params: [brandIds],
  };
}

export default function adminDashboardSummaryRoutes({
  pool,
  authMiddleware,
  wrap,
}) {
  const router = express.Router();

  router.get(
    "/admin/dashboard-summary",
    authMiddleware,
    wrap(async (req, res) => {
      const email = getUserEmail(req);
      const role = getReqRole(req);
      const forcedSlug = getForcedBrandSlug(req);
      const brandUser = isBrandUser(req);

      const brandFilter = makeBrandFilter({ forcedSlug });

      const brandsStats = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status,'')) IN ('active','published','live')
          )::int AS active,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status,'')) NOT IN ('active','published','live')
               OR status IS NULL
          )::int AS inactive
        FROM brands
        ${brandFilter.whereSql}
        `,
        brandFilter.values,
        { total: 0, active: 0, inactive: 0 }
      );

      const brands = await manyRowsSafe(
        pool,
        `
        SELECT
          id,
          name,
          slug,
          route,
          status,
          updated_at
        FROM brands
        ${brandFilter.whereSql}
        ORDER BY updated_at DESC NULLS LAST, id DESC
        LIMIT 500
        `,
        brandFilter.values
      );

      const brandIds = brands.map((brand) => brand.id);
      const brandIdFilter = makeBrandIdFilter(brandIds);

      const sharedPages = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status::text,'')) IN ('published','active','live')
          )::int AS published,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status::text,'')) IN ('draft','inactive')
               OR status IS NULL
          )::int AS draft
        FROM brand_shared_pages
        `,
        [],
        { total: 0, published: 0, draft: 0 }
      );

      const uniquePages = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status::text,'')) IN ('published','active','live')
          )::int AS published,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status::text,'')) IN ('draft','inactive')
               OR status IS NULL
          )::int AS draft
        FROM brand_unique_pages
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params,
        { total: 0, published: 0, draft: 0 }
      );

      const supportThreads = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status,'')) IN ('open','active','pending')
          )::int AS open
        FROM brand_support_threads
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params,
        { total: 0, open: 0 }
      );

      const supportMessages = await countSafe(
        pool,
        `
        SELECT COUNT(*)::int AS count
        FROM brand_support_messages
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params
      );

      const blogs = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status,'')) IN ('published','active','live')
          )::int AS published,
          COUNT(*) FILTER (
            WHERE LOWER(COALESCE(status,'')) = 'draft'
          )::int AS draft,
          COUNT(*) FILTER (
            WHERE COALESCE(is_hidden, false) = true
          )::int AS hidden
        FROM blog_posts
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params,
        { total: 0, published: 0, draft: 0, hidden: 0 }
      );

      const blogCategories = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE COALESCE(is_active, true) = true
          )::int AS active,
          COUNT(*) FILTER (
            WHERE COALESCE(is_active, true) = false
          )::int AS inactive
        FROM blog_categories
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params,
        { total: 0, active: 0, inactive: 0 }
      );

      const moduleSettings = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE COALESCE(can_view, false) = true
          )::int AS enabled,
          COUNT(*) FILTER (
            WHERE COALESCE(can_view, false) = false
          )::int AS disabled
        FROM brand_module_permissions
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params,
        { total: 0, enabled: 0, disabled: 0 }
      );

      const websiteSettings = await oneRowSafe(
        pool,
        `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (
            WHERE COALESCE(is_visible, false) = true
          )::int AS visible,
          COUNT(*) FILTER (
            WHERE COALESCE(is_visible, false) = false
          )::int AS hidden
        FROM brand_website_page_visibility
        WHERE 1=1
        ${brandIdFilter.sql}
        `,
        brandIdFilter.params,
        { total: 0, visible: 0, hidden: 0 }
      );

      const adminUsers = brandUser
        ? 0
        : await countSafe(
            pool,
            `
            SELECT COUNT(*)::int AS count
            FROM admins
            `
          );

      const adminPermissions = brandUser
        ? { total: 0, enabled: 0, disabled: 0 }
        : await oneRowSafe(
            pool,
            `
            SELECT
              COUNT(*)::int AS total,
              COUNT(*) FILTER (
                WHERE COALESCE(can_view, false) = true
              )::int AS enabled,
              COUNT(*) FILTER (
                WHERE COALESCE(can_view, false) = false
              )::int AS disabled
            FROM admin_module_permissions
            `,
            [],
            { total: 0, enabled: 0, disabled: 0 }
          );

      const latestBlogs = await manyRowsSafe(
        pool,
        `
        SELECT
          id,
          title,
          slug,
          status,
          updated_at
        FROM blog_posts
        WHERE 1=1
        ${brandIdFilter.sql}
        ORDER BY updated_at DESC NULLS LAST, id DESC
        LIMIT 5
        `,
        brandIdFilter.params
      );

      const recentActivity = [
        ...brands.slice(0, 5).map((brand) => ({
          type: "brand",
          title: brand.name || brand.slug,
          description: `Agency ${brand.status || "status unknown"}`,
          date: brand.updated_at,
          path: `/brands/${brand.id}`,
        })),
        ...latestBlogs.map((blog) => ({
          type: "blog",
          title: blog.title || blog.slug || "Blog",
          description: `Blog ${blog.status || "status unknown"}`,
          date: blog.updated_at,
          path: `/blogs/${blog.id}/edit`,
        })),
      ]
        .filter((item) => item.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);

      const modules = [
        {
          key: "brands",
          label: "Agencies",
          icon: "layers",
          count: Number(brandsStats.total || 0),
          path: "/brands",
        },
        {
          key: "brand_inner_pages",
          label: "Brand Inner Pages",
          icon: "description",
          count: Number(sharedPages.total || 0),
          path: "/brand-inner-pages",
        },
        {
          key: "brand_unique_pages",
          label: "Brand Unique Pages",
          icon: "web",
          count: Number(uniquePages.total || 0),
          path: "/brand-unique-pages",
        },
        {
          key: "support_chat",
          label: "Support Chat",
          icon: "forum",
          count: Number(supportThreads.total || 0),
          path: "/support-chat",
        },
        {
          key: "blogs",
          label: "Blogs",
          icon: "article",
          count: Number(blogs.total || 0),
          path: "/blogs",
        },
        {
          key: "blog_categories",
          label: "Blog Categories",
          icon: "category",
          count: Number(blogCategories.total || 0),
          path: "/blog-categories",
        },
        {
          key: "settings",
          label: "Settings",
          icon: "settings",
          count: Number(moduleSettings.enabled || 0),
          path: "/settings",
        },
        {
          key: "module_settings",
          label: "Module Settings",
          icon: "tune",
          count: Number(moduleSettings.total || 0),
          path: "/settings/modules",
        },
        {
          key: "website_settings",
          label: "Website Settings",
          icon: "language",
          count: Number(websiteSettings.total || 0),
          path: "/website-settings",
        },
        {
          key: "admin_settings",
          label: "Admin Settings",
          icon: "manage_accounts",
          count: Number(adminUsers || 0),
          path: "/admin-settings",
          adminOnly: true,
        },
      ].filter((item) => !item.adminOnly || !brandUser);

      return res.json({
        ok: true,
        debug: {
          email,
          role,
          forcedSlug,
          brandUser,
          brandIds,
        },
        data: {
          brands,
          agencies: {
            total: Number(brandsStats.total || 0),
            active: Number(brandsStats.active || 0),
            inactive: Number(brandsStats.inactive || 0),
          },
          pages: {
            shared: {
              total: Number(sharedPages.total || 0),
              published: Number(sharedPages.published || 0),
              draft: Number(sharedPages.draft || 0),
            },
            unique: {
              total: Number(uniquePages.total || 0),
              published: Number(uniquePages.published || 0),
              draft: Number(uniquePages.draft || 0),
            },
            total:
              Number(sharedPages.total || 0) + Number(uniquePages.total || 0),
            published:
              Number(sharedPages.published || 0) +
              Number(uniquePages.published || 0),
            draft:
              Number(sharedPages.draft || 0) + Number(uniquePages.draft || 0),
          },
          support: {
            threads: Number(supportThreads.total || 0),
            open: Number(supportThreads.open || 0),
            messages: Number(supportMessages || 0),
          },
          blogs: {
            total: Number(blogs.total || 0),
            published: Number(blogs.published || 0),
            draft: Number(blogs.draft || 0),
            hidden: Number(blogs.hidden || 0),
          },
          blogCategories: {
            total: Number(blogCategories.total || 0),
            active: Number(blogCategories.active || 0),
            inactive: Number(blogCategories.inactive || 0),
          },
          moduleSettings: {
            total: Number(moduleSettings.total || 0),
            enabled: Number(moduleSettings.enabled || 0),
            disabled: Number(moduleSettings.disabled || 0),
          },
          websiteSettings: {
            total: Number(websiteSettings.total || 0),
            visible: Number(websiteSettings.visible || 0),
            hidden: Number(websiteSettings.hidden || 0),
          },
          adminSettings: {
            adminUsers,
            permissionsTotal: Number(adminPermissions.total || 0),
            permissionsEnabled: Number(adminPermissions.enabled || 0),
            permissionsDisabled: Number(adminPermissions.disabled || 0),
          },
          modules,
          recentActivity,
        },
      });
    })
  );

  return router;
}