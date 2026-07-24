import { Router } from "express";
import { auditWebsite } from "../controllers/audit.controller.js";

const router = Router();

router.post("/", auditWebsite);

export default router;
