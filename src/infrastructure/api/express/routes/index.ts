import { apiConfig } from "../../../../config/dependencies";
import { Router } from "express";
import apiRoutes from "./api.routes";

const router = Router();

router
  .use(`/api/${apiConfig.version}`, apiRoutes)

export default router;
