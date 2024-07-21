import "./markmap";
import "./shared";
import "./users";
import { RESTAPIService, apiConfig } from "../config/dependencies";
import markmapRoutes from "../modules/markmap/infrastructure/routes";
import authRoutes from "./shared/auth/routes";
import userRoutes from "./users/infrastructure/routes";

RESTAPIService.router.use(
  `/api/${apiConfig.version}`,
  markmapRoutes,
  authRoutes,
  userRoutes
);
