import express from "express";
import cors from "cors";
import auditRoutes from "./routes/audit.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/audit", auditRoutes);

// Global Error Handling Middleware for asyncHandler
app.use((err, req, res, _next) => {
  const statusCode = err.status || err.statusCode || 404;
  return res.status(statusCode).json({
    status: statusCode,
    error: err.message || "Invalid URL or Website Not Found",
  });
});

export default app;
