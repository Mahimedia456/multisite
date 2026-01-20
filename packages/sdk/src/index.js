import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(express.json()); // REQUIRED
app.use("/api", routes); // ✅ API PREFIX

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
