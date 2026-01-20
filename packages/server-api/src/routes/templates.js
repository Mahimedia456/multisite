import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /templates?scope=BRAND&brandSlug=aamir
 * GET /templates?scope=MAIN
 */
router.get("/", requireAuth, async (req, res) => {
  const scope = req.query.scope;
  const brandSlug = req.query.brandSlug;

  if (!scope) return res.status(400).json({ ok: false, error: "scope required" });

  if (scope === "MAIN") {
    const templates = await prisma.template.findMany({
      where: { scope: "MAIN" },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ ok: true, templates });
  }

  if (scope === "BRAND") {
    if (!brandSlug) return res.status(400).json({ ok: false, error: "brandSlug required" });

    const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) return res.status(404).json({ ok: false, error: "Brand not found" });

    const templates = await prisma.template.findMany({
      where: { scope: "BRAND", brandId: brand.id },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ ok: true, templates, brand });
  }

  return res.status(400).json({ ok: false, error: "Invalid scope" });
});

/**
 * GET /templates/:id (includes latest version)
 */
router.get("/:id", requireAuth, async (req, res) => {
  const t = await prisma.template.findUnique({
    where: { id: req.params.id },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!t) return res.status(404).json({ ok: false, error: "Template not found" });

  res.json({ ok: true, template: t, latest: t.versions[0] || null });
});

/**
 * POST /templates/:id/save
 * body: { content: {...json} }
 */
router.post("/:id/save", requireAuth, async (req, res) => {
  const { content } = req.body || {};
  if (!content) return res.status(400).json({ ok: false, error: "content required" });

  const t = await prisma.template.findUnique({
    where: { id: req.params.id },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!t) return res.status(404).json({ ok: false, error: "Template not found" });

  const nextVersion = (t.versions[0]?.version || 0) + 1;

  const v = await prisma.templateVersion.create({
    data: {
      templateId: t.id,
      version: nextVersion,
      content,
      createdBy: req.user.sub,
    },
  });

  await prisma.template.update({
    where: { id: t.id },
    data: { updatedAt: new Date() },
  });

  res.json({ ok: true, version: v });
});

export default router;
