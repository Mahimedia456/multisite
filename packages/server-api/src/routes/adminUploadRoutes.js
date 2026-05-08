import express from "express";
import crypto from "crypto";

export default function adminUploadRoutes({
  authMiddleware,
  wrap,
  supabaseAdmin,
  supabaseBucket,
}) {
  const router = express.Router();

  router.post(
    "/admin/upload",
    authMiddleware,
    wrap(async (req, res) => {
      if (!supabaseAdmin) {
        return res.status(500).json({
          ok: false,
          message: "Supabase not configured",
        });
      }

      const { dataUrl, fileName, folder = "shared-pages" } = req.body || {};

      if (
        !dataUrl ||
        typeof dataUrl !== "string" ||
        !dataUrl.startsWith("data:")
      ) {
        return res.status(400).json({
          ok: false,
          message: "dataUrl (base64) is required",
        });
      }

      const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);

      if (!m) {
        return res.status(400).json({
          ok: false,
          message: "Invalid dataUrl",
        });
      }

      const contentType = m[1];
      const b64 = m[2];
      const buffer = Buffer.from(b64, "base64");

      const ext = contentType.includes("png")
        ? "png"
        : contentType.includes("jpeg")
        ? "jpg"
        : contentType.includes("webp")
        ? "webp"
        : contentType.includes("gif")
        ? "gif"
        : "bin";

      const safeName = String(fileName || "asset")
        .replace(/[^a-z0-9._-]/gi, "_")
        .slice(0, 80);

      const hash = crypto.randomBytes(8).toString("hex");
      const path = `${folder}/${Date.now()}-${hash}-${safeName}.${ext}`;

      const { error: upErr } = await supabaseAdmin.storage
        .from(supabaseBucket)
        .upload(path, buffer, {
          contentType,
          upsert: true,
          cacheControl: "3600",
        });

      if (upErr) {
        return res.status(500).json({
          ok: false,
          message: upErr.message,
        });
      }

      const { data } = supabaseAdmin.storage
        .from(supabaseBucket)
        .getPublicUrl(path);

      return res.json({
        ok: true,
        url: data?.publicUrl,
        path,
      });
    })
  );

  return router;
}