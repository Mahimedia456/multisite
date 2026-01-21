import cors from "cors";

const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: origins,
  credentials: true,
}));

app.options("*", cors());
