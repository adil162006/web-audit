import { performAudit } from "../services/audit.service.js";
import { asyncHandler } from "../utils/Asynchandler.js";

export const auditWebsite = asyncHandler(async (req, res) => {
  const { url } = req.body || {};

  if (!url) {
    const error = new Error("URL is required");
    error.status = 404;
    throw error;
  }

  const report = await performAudit(url);
  return res.status(200).json(report);
});
