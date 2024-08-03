import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
  createNewMarkmap,
} from "../../../../modules/markmap/application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/markmap", (router: any) => {
  router
    .post("/create", controllerAdapter(createNewMarkmap))
    .post("/transformfiletomarkmap", controllerAdapter(transformFileToMarkmap))
    .put("/update", controllerAdapter(updateMarkmap))
    .get("/getmanymarkmaps", controllerAdapter(getManyMarkmaps));
});
