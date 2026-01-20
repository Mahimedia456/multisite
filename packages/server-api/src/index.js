import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/auth.js";
import brandsRouter from "./routes/brands.js";
import templatesRouter from "./routes/templates.js";
import pagesRouter from "./routes/pages.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/brands", brandsRouter);
app.use("/templates", templatesRouter);
app.use("/pages", pagesRouter);

const PORT = Number(process.env.API_PORT || 5050);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
