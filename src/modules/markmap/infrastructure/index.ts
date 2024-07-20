import { RepositoryService } from "../../../config/dependencies";
import "./routes"
import { Markmap } from "./models/mongoose";
RepositoryService.addModel("Markmap", Markmap);
export { Markmap };
