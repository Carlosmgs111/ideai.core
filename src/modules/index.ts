import "./markmap";
import "./shared";
import "./users";
import { RESTAPIService, apiConfig } from "../config/dependencies";
import markmapRoutes from "../modules/markmap/infrastructure/routes";
import authRoutes from "../modules/shared/auth/routes/express.routes";
RESTAPIService.router.use(
  `/api/${apiConfig.version}`,
  RESTAPIService.addPath()
    .use("/markmap", markmapRoutes)
    .use("", authRoutes)
    .use("/user", () => {})
);

console.log(RESTAPIService.router);
