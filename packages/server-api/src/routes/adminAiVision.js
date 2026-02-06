import express from "express";
import { runVisionPlanner } from "../ai/visionPlanner.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * POST /admin/ai/vision-plan
 * body:
 * {
 *   brand: { name, description, colors }
 *   referenceImageUrl: string
 *   prompt?: string
 * }
 */
router.post("/admin/ai/vision-plan", requireAuth, async (req, res) => {
  try {
    const { brand, referenceImageUrl, prompt } = req.body || {};

    if (!brand?.name) {
      return res.status(400).json({
        ok: false,
        message: "brand is required",
      });
    }

    if (!referenceImageUrl) {
      return res.status(400).json({
        ok: false,
        message: "referenceImageUrl is required",
      });
    }

    const plan = await runVisionPlanner({
      brand,
      referenceImageUrl,
      prompt,
    });

    // ✅ safety checks
    if (
      !Array.isArray(plan?.sections) ||
      !Array.isArray(plan?.design?.sectionBands)
    ) {
      throw new Error("Invalid vision planner output structure");
    }

    if (plan.sections.length !== plan.design.sectionBands.length) {
      throw new Error("sections and sectionBands length mismatch");
    }

    return res.json({
      ok: true,
      data: plan,
    });
  } catch (e) {
    console.error("VISION PLAN ERROR:", e);
    return res.status(500).json({
      ok: false,
      message: e?.message || "Vision planner failed",
    });
  }
});

export default router;
