import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const brands = await prisma.brand.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ ok: true, brands });
});

router.get("/:slug", requireAuth, async (req, res) => {
  const brand = await prisma.brand.findUnique({ where: { slug: req.params.slug } });
  if (!brand) return res.status(404).json({ ok: false, error: "Brand not found" });
  res.json({ ok: true, brand });
});

export default router;
