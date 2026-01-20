import express from "express";

export function createSdkServer(routes) {
  const app = express();
  app.use(express.json());
  if (routes) app.use(routes);
  return app;
}
