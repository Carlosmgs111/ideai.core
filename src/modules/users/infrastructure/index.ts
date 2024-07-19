import { RepositoryService } from "../../../config/dependencies";
import { User } from "./models/mongoose";
RepositoryService.addModel("User", User);
export { User };
