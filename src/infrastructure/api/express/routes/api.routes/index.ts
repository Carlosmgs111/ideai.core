import { Router } from "express";
import markmapRoutes from "../../../../../modules/markmap/infrastructure/routes";
import authRoutes from "../../../../../modules/shared/auth/routes/express.routes";

const router = Router();

export default router.use("/markmap", markmapRoutes).use("", authRoutes);
