import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /pages?scope=BRAND&brandSlug=aamir
 * GET /pages?scope=MAIN
 */
router.get("/", requireAuth, async (req, res) => {
  const scope = req.query.scope;
  const brandSlug = req.query.brandSlug;

  if (!scope) return res.status(400).json({ ok: false, error: "scope required" });

  if (scope === "MAIN") {
    const pages = await prisma.innerPage.findMany({
      where: { scope: "MAIN" },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ ok: true, pages });
  }

  if (scope === "BRAND") {
    if (!brandSlug) return res.status(400).json({ ok: false, error: "brandSlug required" });

    const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) return res.status(404).json({ ok: false, error: "Brand not found" });

    const pages = await prisma.innerPage.findMany({
      where: { scope: "BRAND", brandId: brand.id },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ ok: true, pages, brand });
  }

  return res.status(400).json({ ok: false, error: "Invalid scope" });
});

/**
 * GET /pages/:id (includes latest version)
 */
router.get("/:id", requireAuth, async (req, res) => {
  const p = await prisma.innerPage.findUnique({
    where: { id: req.params.id },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!p) return res.status(404).json({ ok: false, error: "Page not found" });

  res.json({ ok: true, page: p, latest: p.versions[0] || null });
});

/**
 * POST /pages/:id/save
 * body: { content: {...json} }
 */
router.post("/:id/save", requireAuth, async (req, res) => {
  const { content } = req.body || {};
  if (!content) return res.status(400).json({ ok: false, error: "content required" });

  const p = await prisma.innerPage.findUnique({
    where: { id: req.params.id },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!p) return res.status(404).json({ ok: false, error: "Page not found" });

  const nextVersion = (p.versions[0]?.version || 0) + 1;

  const v = await prisma.innerPageVersion.create({
    data: {
      pageId: p.id,
      version: nextVersion,
      content,
      createdBy: req.user.sub,
    },
  });

  await prisma.innerPage.update({
    where: { id: p.id },
    data: { updatedAt: new Date() },
  });

  res.json({ ok: true, version: v });
});

export default router;
