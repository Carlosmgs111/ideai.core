import { RepositoryService } from "../../../config/dependencies";
import { Markmap } from "./models/mongoose";
RepositoryService.addModel("Markmap", Markmap);
export { Markmap };
