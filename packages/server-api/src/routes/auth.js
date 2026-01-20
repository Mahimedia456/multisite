import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in server-api .env");
}

router.post("/login", async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({
        ok: false,
        error: "Server misconfigured: JWT_SECRET missing",
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: remember ? "30d" : JWT_EXPIRES_IN }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
