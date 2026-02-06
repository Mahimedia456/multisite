import express from "express";
import { runSectionCodeGen } from "../ai/sectionCodeGen.js";

const router = express.Router();

/**
 * POST /admin/ai/section-code
 * body:
 * {
 *   brand, visionPlan, contentJson, themeJson, pagePlan, prompt?
 * }
 */
export default function adminAiSectionCodeRoutes({ authMiddleware }) {
  router.post("/admin/ai/section-code", authMiddleware, async (req, res) => {
    try {
      const { brand, visionPlan, contentJson, themeJson, pagePlan, prompt } = req.body || {};

      if (!brand?.name) return res.status(400).json({ ok: false, message: "brand required" });
      if (!Array.isArray(visionPlan?.sections)) return res.status(400).json({ ok: false, message: "visionPlan required" });
      if (!contentJson || typeof contentJson !== "object") return res.status(400).json({ ok: false, message: "contentJson required" });
      if (!themeJson?.cssVars) return res.status(400).json({ ok: false, message: "themeJson required" });
      if (!pagePlan?.pages?.Home) return res.status(400).json({ ok: false, message: "pagePlan required" });

      const out = await runSectionCodeGen({
        brand,
        visionPlan,
        contentJson,
        themeJson,
        pagePlan,
        prompt,
      });

      return res.json({ ok: true, data: out });
    } catch (e) {
      console.error("SECTION CODE ERROR:", e);
      return res.status(500).json({ ok: false, message: e?.message || "Section code failed" });
    }
  });

  return router;
}
