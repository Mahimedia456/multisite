import express from "express";
import prisma from "../prisma.js"; // adjust path to your prisma client

const router = express.Router();

/**
 * GET /api/brands
 * Optional query params:
 *  - q: string
 *  - status: all | active | inactive
 */
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const status = (req.query.status || "all").toString();

    const where = {
      ...(status !== "all" ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { route: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { status: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const brands = await prisma.tb_brands.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    res.json({ ok: true, data: brands });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to fetch brands" });
  }
});

/**
 * GET /api/brands/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const brand = await prisma.tb_brands.findUnique({
      where: { id: req.params.id },
    });
    if (!brand) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, data: brand });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to fetch brand" });
  }
});

/**
 * POST /api/brands
 */
router.post("/", async (req, res) => {
  try {
    const { slug, name, route, status, templates, icon, iconBg, iconColor } = req.body;

    if (!slug || !name || !route) {
      return res.status(400).json({ ok: false, message: "slug, name, route required" });
    }

    const brand = await prisma.tb_brands.create({
      data: {
        slug,
        name,
        route,
        status: status || "active",
        templates: Number.isFinite(templates) ? templates : 0,
        icon,
        iconBg,
        iconColor,
      },
    });

    res.status(201).json({ ok: true, data: brand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to create brand" });
  }
});

/**
 * PATCH /api/brands/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    const brand = await prisma.tb_brands.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ ok: true, data: brand });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to update brand" });
  }
});

/**
 * DELETE /api/brands/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.tb_brands.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to delete brand" });
  }
});

export default router;
