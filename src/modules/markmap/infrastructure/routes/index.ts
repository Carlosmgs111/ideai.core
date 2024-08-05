import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
  createNewMarkmap,
  deleteMarkmap,
} from "../../../../modules/markmap/application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/markmap", (router: any) => {
  router
    .post(
      "/transformfiletomarkmap",
      RESTAPIService.controllerAdapter(transformFileToMarkmap)
    )
    .put("/update", RESTAPIService.controllerAdapter(updateMarkmap))
    .get("/getmanymarkmaps", RESTAPIService.controllerAdapter(getManyMarkmaps));
});