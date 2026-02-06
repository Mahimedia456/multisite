import express from "express";
import { runHomeContentWriter } from "../ai/contentWriter.js";

const router = express.Router();

/**
 * POST /admin/ai/generate-home-content
 * body:
 * {
 *   brand: { name, description, colors, font, company, slug, route },
 *   visionPlan: { design:{...}, sections:[...] },
 *   prompt?: string
 * }
 */
export default function adminAiContentRoutes({ authMiddleware }) {
  router.post("/admin/ai/generate-home-content", authMiddleware, async (req, res) => {
    try {
      const { brand, visionPlan, prompt } = req.body || {};

      if (!brand?.name) {
        return res.status(400).json({ ok: false, message: "brand is required" });
      }
      if (!visionPlan?.design || !Array.isArray(visionPlan?.sections)) {
        return res.status(400).json({ ok: false, message: "visionPlan is required" });
      }

      const contentJson = await runHomeContentWriter({
        brand,
        visionPlan,
        prompt,
      });

      return res.json({ ok: true, data: contentJson });
    } catch (e) {
      console.error("CONTENT WRITER ERROR:", e);
      return res.status(500).json({
        ok: false,
        message: e?.message || "Content writer failed",
      });
    }
  });

  return router;
}
