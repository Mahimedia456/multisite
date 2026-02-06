import express from "express";

export default function adminAiThemeRoutes({ authMiddleware } = {}) {
  const router = express.Router();

  // health check (optional)
  router.get("/admin/ai/theme", authMiddleware, (req, res) => {
    res.json({ ok: true, message: "adminAiTheme route ready" });
  });

  // main (placeholder)
  router.post("/admin/ai/theme", authMiddleware, async (req, res) => {
    // TODO: Step 3 theme generation logic here
    res.json({
      ok: true,
      data: {
        note: "Theme route placeholder. Implement Step-3 here.",
        received: req.body || {},
      },
    });
  });

  return router;
}
