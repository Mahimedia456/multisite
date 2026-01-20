import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

/**
 * Detect Prisma model names (you may need to adjust once you confirm schema.prisma model names)
 */
const PAGES = prisma.inner_pages ?? prisma.innerPages ?? prisma.innerPage;
const VERSIONS =
  prisma.inner_page_versions ?? prisma.innerPageVersions ?? prisma.innerPageVersion;

function ensureModels(res) {
  if (!PAGES || !VERSIONS) {
    res.status(500).json({
      ok: false,
      message:
        "Prisma models for inner pages not found. Check schema.prisma model names (inner_pages / inner_page_versions)."
    });
    return false;
  }
  return true;
}

/**
 * GET /brands/:brandId/pages
 * Returns pages for BRAND scope, with latest status + modified time
 */
router.get("/brands/:brandId/pages", async (req, res) => {
  try {
    if (!ensureModels(res)) return;

    const { brandId } = req.params;
    const q = String(req.query.q ?? "").trim();

    const where = {
      scope: "BRAND",
      brand_id: brandId,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const pages = await PAGES.findMany({
      where,
      orderBy: { created_at: "desc" }
    });

    // For each page, find latest version
    const pageIds = pages.map((p) => p.id);

    const versions = await VERSIONS.findMany({
      where: { page_id: { in: pageIds } },
      orderBy: { created_at: "desc" }
    });

    // Map latest version per page
    const latestByPage = new Map();
    for (const v of versions) {
      if (!latestByPage.has(v.page_id)) latestByPage.set(v.page_id, v);
    }

    const data = pages.map((p) => {
      const latest = latestByPage.get(p.id);
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        status: latest?.status ?? "DRAFT",
        modifiedAt: latest?.created_at ?? p.created_at
      };
    });

    res.json({ ok: true, data });
  } catch (err) {
    console.error("GET brand pages failed:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch inner pages", error: err?.message });
  }
});

/**
 * POST /brands/:brandId/pages
 * Body: { slug, title, templateKey, initialStatus? }
 *
 * Creates inner_pages row + first version row with JSON content.
 */
router.post("/brands/:brandId/pages", async (req, res) => {
  try {
    if (!ensureModels(res)) return;

    const { brandId } = req.params;
    const { slug, title, templateKey, initialStatus } = req.body || {};

    if (!slug || !title || !templateKey) {
      return res.status(400).json({
        ok: false,
        message: "slug, title, templateKey are required"
      });
    }

    // 1) Create page
    const page = await PAGES.create({
      data: {
        scope: "BRAND",
        brand_id: brandId,
        slug,
        title
      }
    });

    // 2) Create first version (draft by default)
    const version = await VERSIONS.create({
      data: {
        page_id: page.id,
        status: (initialStatus ?? "DRAFT").toUpperCase(),
        content: {
          templateKey, // e.g. "about-shared"
          props: {} // optional payload you can extend later
        }
      }
    });

    res.status(201).json({ ok: true, data: { page, version } });
  } catch (err) {
    console.error("POST brand pages failed:", err);
    res.status(500).json({ ok: false, message: "Failed to create inner page", error: err?.message });
  }
});

/**
 * GET /brands/:brandId/pages/:pageId
 * Returns page + latest version content
 */
router.get("/brands/:brandId/pages/:pageId", async (req, res) => {
  try {
    if (!ensureModels(res)) return;

    const { brandId, pageId } = req.params;

    const page = await PAGES.findFirst({
      where: { id: pageId, scope: "BRAND", brand_id: brandId }
    });

    if (!page) return res.status(404).json({ ok: false, message: "Page not found" });

    const latest = await VERSIONS.findFirst({
      where: { page_id: pageId },
      orderBy: { created_at: "desc" }
    });

    res.json({ ok: true, data: { page, latestVersion: latest } });
  } catch (err) {
    console.error("GET page detail failed:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch page", error: err?.message });
  }
});

/**
 * POST /brands/:brandId/pages/:pageId/publish
 * Creates a new version with status PUBLISHED using last content (or provided content)
 */
router.post("/brands/:brandId/pages/:pageId/publish", async (req, res) => {
  try {
    if (!ensureModels(res)) return;

    const { brandId, pageId } = req.params;

    const page = await PAGES.findFirst({
      where: { id: pageId, scope: "BRAND", brand_id: brandId }
    });
    if (!page) return res.status(404).json({ ok: false, message: "Page not found" });

    const latest = await VERSIONS.findFirst({
      where: { page_id: pageId },
      orderBy: { created_at: "desc" }
    });

    const content = req.body?.content ?? latest?.content;
    if (!content) return res.status(400).json({ ok: false, message: "No content to publish" });

    const published = await VERSIONS.create({
      data: {
        page_id: pageId,
        status: "PUBLISHED",
        content
      }
    });

    res.json({ ok: true, data: published });
  } catch (err) {
    console.error("Publish failed:", err);
    res.status(500).json({ ok: false, message: "Failed to publish", error: err?.message });
  }
});

/**
 * Public website: GET /public/brands/:brandSlug/pages/:slug
 * Returns latest PUBLISHED version for that brand + page slug
 */
router.get("/public/brands/:brandSlug/pages/:slug", async (req, res) => {
  try {
    if (!ensureModels(res)) return;

    const { brandSlug, slug } = req.params;

    // find brand by slug
    const brandModel = prisma.brands ?? prisma.brand;
    if (!brandModel) {
      return res.status(500).json({ ok: false, message: "Brand model not found in Prisma" });
    }

    const brand = await brandModel.findFirst({ where: { slug: brandSlug } });
    if (!brand) return res.status(404).json({ ok: false, message: "Brand not found" });

    const page = await PAGES.findFirst({
      where: { scope: "BRAND", brand_id: brand.id, slug }
    });
    if (!page) return res.status(404).json({ ok: false, message: "Page not found" });

    const published = await VERSIONS.findFirst({
      where: { page_id: page.id, status: "PUBLISHED" },
      orderBy: { created_at: "desc" }
    });

    if (!published) return res.status(404).json({ ok: false, message: "No published version" });

    res.json({
      ok: true,
      data: {
        page: { id: page.id, slug: page.slug, title: page.title },
        version: { id: published.id, status: published.status, content: published.content }
      }
    });
  } catch (err) {
    console.error("Public page fetch failed:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch public page", error: err?.message });
  }
});

export default router;
