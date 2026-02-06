import express from "express";
import { runThemeGenerator } from "../ai/themeGenerator.js";

const router = express.Router();

/**
 * POST /admin/ai/generate-theme
 * body:
 * {
 *   brand: { name, description, colors, font, company },
 *   visionPlan: { design, sections },
 *   prompt?: string
 * }
 */
export default function adminAiThemeRoutes({ authMiddleware }) {
  router.post("/admin/ai/generate-theme", authMiddleware, async (req, res) => {
    try {
      const { brand, visionPlan, prompt } = req.body || {};

      if (!brand?.name) {
        return res.status(400).json({ ok: false, message: "brand is required" });
      }
      if (!visionPlan?.design) {
        return res.status(400).json({ ok: false, message: "visionPlan is required" });
      }

      const themeJson = await runThemeGenerator({ brand, visionPlan, prompt });

      return res.json({ ok: true, data: themeJson });
    } catch (e) {
      console.error("THEME GENERATOR ERROR:", e);
      return res.status(500).json({
        ok: false,
        message: e?.message || "Theme generator failed",
      });
    }
  });

  return router;
}
