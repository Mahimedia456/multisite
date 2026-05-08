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

function activityPath(row) {
  if (row.module_key === "brands" && row.brand_id) {
    return `/brands/${row.brand_id}`;
  }

  if (row.module_key === "blogs" && row.entity_id) {
    return `/blogs/${row.entity_id}/edit`;
  }

  if (row.module_key === "support_chat") {
    return "/support-chat";
  }

  if (row.module_key === "brand_inner_pages") {
    return "/brand-inner-pages";
  }

  if (row.module_key === "brand_unique_pages") {
    return "/brand-unique-pages";
  }

  if (row.module_key === "module_settings") {
    return "/settings/modules";
  }

  if (row.module_key === "website_settings") {
    return "/website-settings";
  }

  if (row.module_key === "admin_settings") {
    return "/admin-settings";
  }

  return "/dashboard";
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

      const activityWhere = [];
      const activityVals = [];

      if (brandUser && forcedSlug) {
        activityVals.push(forcedSlug);
        activityWhere.push(
          `LOWER(COALESCE(brand_slug,'')) = $${activityVals.length}`
        );
      }

      const activityWhereSql = activityWhere.length
        ? `WHERE ${activityWhere.join(" AND ")}`
        : "";

      const activityRows = await manyRowsSafe(
        pool,
        `
        SELECT
          id,
          brand_id,
          brand_slug,
          brand_name,
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
          created_at
        FROM activity_logs
        ${activityWhereSql}
        ORDER BY created_at DESC
        LIMIT 20
        `,
        activityVals
      );

      const fallbackRecentActivity = brands.slice(0, 8).map((brand) => ({
        id: brand.id,
        type: "brand",
        title: brand.name || brand.slug,
        description: `Agency ${brand.status || "status unknown"}`,
        moduleLabel: "Brands",
        action: "updated",
        actorEmail: "",
        actorRole: "",
        brandName: brand.name,
        brandSlug: brand.slug,
        date: brand.updated_at,
        path: `/brands/${brand.id}`,
      }));

      const recentActivity = activityRows.length
        ? activityRows.map((row) => ({
            id: row.id,
            type: row.module_key,
            title: row.title,
            description: row.description,
            moduleLabel: row.module_label,
            action: row.action,
            actorEmail: row.actor_email,
            actorRole: row.actor_role,
            brandName: row.brand_name,
            brandSlug: row.brand_slug,
            date: row.created_at,
            path: activityPath(row),
          }))
        : fallbackRecentActivity;

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