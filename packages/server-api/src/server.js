import app from "./app.js";

const PORT = Number(process.env.PORT || process.env.API_PORT || 5050);

app.listen(PORT, () => {
  console.log(`✅ server-api running on http://localhost:${PORT}`);
});
