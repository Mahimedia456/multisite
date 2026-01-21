import { Router } from "express";
import adminRoutes from "./admin.js";
import brandsRoutes from "./brands.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/brands", brandsRoutes);

router.get("/health", (req, res) => res.json({ ok: true }));

export default router;
