import "colors";
import app from "./infrastructure/api/express/index";
import "./modules"; 
(async () => {
  await app();
})();
