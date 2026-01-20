import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import brandsRouter from "./routes/brands.routes.js";
import templatesRouter from "./routes/templates.js";
import pagesRouter from "./routes/pages.js";
import innerPagesRouter from "./routes/innerPages.routes.js";

dotenv.config();

const app = express();

// CORS: allow Vite dev servers + credentials
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

// Main routes (as your frontend expects)
app.use("/auth", authRouter);
app.use("/templates", templatesRouter);
app.use("/pages", pagesRouter);
app.use("/", innerPagesRouter);

// Optional alias (if some frontend code calls /api/brands)
app.use("/api/brands", brandsRouter);

// Use API_PORT (your choice) and fallback to 5050
const PORT = Number(process.env.API_PORT || 5050);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});