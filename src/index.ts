import "colors";
import app from "./infrastructure/api/express/index";
import { RepositoryService } from "./config/dependencies";

RepositoryService.info();

(async () => {
  await app();
})();
