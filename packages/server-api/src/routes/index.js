import express from "express";

import authRoutes from "./auth.js";
import brandsRoutes from "./brands.routes.js"; // ✅ add
import pagesRoutes from "./pages.js";
import templatesRoutes from "./templates.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/brands", brandsRoutes); // ✅ add
router.use("/pages", pagesRoutes);
router.use("/templates", templatesRoutes);

export default router;
