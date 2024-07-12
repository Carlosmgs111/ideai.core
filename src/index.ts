import "colors";
import app from "./infrastructure/api/express/index";
import { RepositoryService , SocketService} from "./config/dependencies";

RepositoryService.info();

(async () => {
  await app();
})();
