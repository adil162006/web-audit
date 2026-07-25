import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import auditRoutes from "./routes/audit.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/audit", auditRoutes);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    status: statusCode,
    error: err.message || "Internal Server Error",
  });
});

export default app;