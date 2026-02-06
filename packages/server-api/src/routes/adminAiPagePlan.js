import express from "express";
import { runPagePlanner } from "../ai/pagePlanner.js";

const router = express.Router();

/**
 * POST /admin/ai/page-plan
 * body:
 * {
 *   brand: {...},
 *   visionPlan: {...},
 *   contentJson: {...},
 *   themeJson: {...},
 *   prompt?: string
 * }
 */
export default function adminAiPagePlanRoutes({ authMiddleware }) {
  router.post("/admin/ai/page-plan", authMiddleware, async (req, res) => {
    try {
      const { brand, visionPlan, contentJson, themeJson, prompt } = req.body || {};

      if (!brand?.name) {
        return res.status(400).json({ ok: false, message: "brand is required" });
      }
      if (!visionPlan?.design || !Array.isArray(visionPlan?.sections)) {
        return res.status(400).json({ ok: false, message: "visionPlan is required" });
      }
      if (!contentJson || typeof contentJson !== "object") {
        return res.status(400).json({ ok: false, message: "contentJson is required" });
      }
      if (!themeJson?.cssVars) {
        return res.status(400).json({ ok: false, message: "themeJson is required" });
      }

      const pagePlan = await runPagePlanner({
        brand,
        visionPlan,
        contentJson,
        themeJson,
        prompt,
      });

      return res.json({ ok: true, data: pagePlan });
    } catch (e) {
      console.error("PAGE PLAN ERROR:", e);
      return res.status(500).json({
        ok: false,
        message: e?.message || "Page planner failed",
      });
    }
  });

  return router;
}
