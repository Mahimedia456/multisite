import express from "express";
import bcrypt from "bcrypt";

export default function authRoutes({ pool, wrap, signToken, moduleLabels }) {
  const router = express.Router();

  async function getPermissionsForUser({ role, email, brandSlug }) {
    const lowerEmail = String(email || "").toLowerCase();

    if (brandSlug) {
      const { rows } = await pool.query(
        `
        SELECT module_key
        FROM brand_module_permissions bmp
        JOIN brands b ON b.id = bmp.brand_id
        WHERE LOWER(b.slug) = $1
          AND bmp.can_view = true
        ORDER BY module_key ASC
        `,
        [String(brandSlug).toLowerCase()]
      );

      const dynamicPermissions = rows
        .map((r) => moduleLabels[r.module_key] || r.module_key)
        .filter(Boolean);

      return Array.from(new Set(["Overview", "Brands", ...dynamicPermissions]));
    }

    if (role === "admin") {
      const { rows } = await pool.query(
        `
        SELECT module_key
        FROM admin_module_permissions
        WHERE LOWER(email) = $1
          AND can_view = true
        ORDER BY module_key ASC
        `,
        [lowerEmail]
      );

      if (rows.length) {
        return rows
          .map((r) => moduleLabels[r.module_key] || r.module_key)
          .filter(Boolean);
      }

      return ["Overview", "Brands"];
    }

    return ["Overview"];
  }

  router.post(
    "/admin/login",
    wrap(async (req, res) => {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({
          ok: false,
          message: "Email and password are required",
        });
      }

      const { rows } = await pool.query(
        `
        SELECT id, email, password_hash, role
        FROM admins
        WHERE email = $1
        LIMIT 1
        `,
        [String(email).toLowerCase()]
      );

      const admin = rows[0];

      if (!admin) {
        return res.status(401).json({
          ok: false,
          message: "Invalid email or password",
        });
      }

      const ok = await bcrypt.compare(password, admin.password_hash);

      if (!ok) {
        return res.status(401).json({
          ok: false,
          message: "Invalid email or password",
        });
      }

      let brandSlug = null;
      const lowerEmail = String(admin.email || "").toLowerCase();

      if (lowerEmail.includes("allianz3")) brandSlug = "kundler3";
      if (lowerEmail.includes("allianz4")) brandSlug = "allianz4";

      const role = admin.role || (brandSlug ? "brand_admin" : "admin");

      const access_token = signToken({
        id: admin.id,
        email: admin.email,
        role,
        brandSlug,
      });

      const permissions = await getPermissionsForUser({
        role,
        email: admin.email,
        brandSlug,
      });

      return res.json({
        ok: true,
        access_token,
        user: {
          id: admin.id,
          email: admin.email,
          role,
          permissions,
          name: admin.email.split("@")[0],
          slug: brandSlug || "holding",
          brandSlug,
        },
      });
    })
  );

  return router;
}