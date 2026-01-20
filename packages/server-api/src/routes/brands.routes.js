import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

/**
 * IMPORTANT:
 * Set this to your actual Prisma model name.
 * Common ones: prisma.brand, prisma.brands
 *
 * If you’re not sure, open:
 * packages/server-api/prisma/schema.prisma
 * and check: model <Name> { ... }
 */
const BRAND_MODEL = prisma.brand ?? prisma.brands; // pick whichever exists

function normalizeStatus(input) {
  if (!input) return null;
  const s = String(input).trim().toUpperCase();
  if (s === "ALL") return null;
  if (s === "ACTIVE" || s === "INACTIVE") return s;
  // accept lowercase versions too
  if (s === "ACTIVE".toLowerCase().toUpperCase()) return s;
  return null;
}

/**
 * GET /api/brands
 * Query:
 *  - q: string (search in name/route/slug/status/domain)
 *  - status: all | ACTIVE | INACTIVE (case-insensitive)
 */
router.get("/", async (req, res) => {
  try {
    if (!BRAND_MODEL) {
      return res.status(500).json({
        ok: false,
        message:
          'Brand Prisma model not found. Update BRAND_MODEL (prisma.brand / prisma.brands) to match schema.prisma.'
      });
    }

    const q = String(req.query.q ?? "").trim();
    const status = normalizeStatus(req.query.status ?? "all");

    // Build where clause safely
    const where = {};

    if (status) where.status = status;

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { route: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { status: { contains: q, mode: "insensitive" } },

        // Optional fields — include them only if they exist in schema
        // If these error, comment them out (depends on your Prisma model fields)
        { primary_domain: { contains: q, mode: "insensitive" } }
      ];
    }

    // Avoid assuming updatedAt exists.
    // If your Prisma model has updatedAt, keep this.
    // If not, change to createdAt, or remove orderBy.
    let brands;
    try {
      brands = await BRAND_MODEL.findMany({
        where,
        orderBy: { updatedAt: "desc" }
      });
    } catch (e) {
      // fallback if updatedAt not in schema
      brands = await BRAND_MODEL.findMany({ where });
    }

    return res.json({ ok: true, data: brands });
  } catch (err) {
    console.error("GET /api/brands failed:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch brands",
      error: err?.message
    });
  }
});

/**
 * GET /api/brands/:id
 */
router.get("/:id", async (req, res) => {
  try {
    if (!BRAND_MODEL) {
      return res.status(500).json({ ok: false, message: "Brand model not configured" });
    }

    const brand = await BRAND_MODEL.findUnique({
      where: { id: req.params.id }
    });

    if (!brand) return res.status(404).json({ ok: false, message: "Not found" });
    return res.json({ ok: true, data: brand });
  } catch (err) {
    console.error("GET /api/brands/:id failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to fetch brand", error: err?.message });
  }
});

/**
 * POST /api/brands
 */
router.post("/", async (req, res) => {
  try {
    if (!BRAND_MODEL) {
      return res.status(500).json({ ok: false, message: "Brand model not configured" });
    }

    const {
      slug,
      name,
      route,
      status,
      primary_domain,
      accent_color
    } = req.body || {};

    if (!slug || !name || !route) {
      return res.status(400).json({ ok: false, message: "slug, name, route required" });
    }

    const normalizedStatus = normalizeStatus(status) || "ACTIVE";

    const brand = await BRAND_MODEL.create({
      data: {
        slug,
        name,
        route,
        status: normalizedStatus,

        // Include these only if they exist in your Prisma model:
        ...(primary_domain !== undefined ? { primary_domain } : {}),
        ...(accent_color !== undefined ? { accent_color } : {})
      }
    });

    return res.status(201).json({ ok: true, data: brand });
  } catch (err) {
    console.error("POST /api/brands failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to create brand", error: err?.message });
  }
});

/**
 * PATCH /api/brands/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    if (!BRAND_MODEL) {
      return res.status(500).json({ ok: false, message: "Brand model not configured" });
    }

    const data = { ...(req.body || {}) };

    if (data.status) {
      data.status = normalizeStatus(data.status) || data.status;
    }

    const brand = await BRAND_MODEL.update({
      where: { id: req.params.id },
      data
    });

    return res.json({ ok: true, data: brand });
  } catch (err) {
    console.error("PATCH /api/brands/:id failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to update brand", error: err?.message });
  }
});

/**
 * DELETE /api/brands/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    if (!BRAND_MODEL) {
      return res.status(500).json({ ok: false, message: "Brand model not configured" });
    }

    await BRAND_MODEL.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/brands/:id failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to delete brand", error: err?.message });
  }
});

export default router;
