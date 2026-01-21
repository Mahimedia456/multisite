import cors from "cors";

app.use(
  cors({
    origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
    credentials: true,
  })
);
