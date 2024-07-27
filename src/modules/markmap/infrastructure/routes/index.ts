import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
} from "../../../../modules/markmap/application/use_cases";

export default RESTAPIService.addPath("/markmap", (router: any) => {
  router
    .post(
      "/transformfiletomarkmap",
      RESTAPIService.controllerAdapter(transformFileToMarkmap)
    )
    .put("/update", RESTAPIService.controllerAdapter(updateMarkmap))
    .get("/getmanymarkmaps", RESTAPIService.controllerAdapter(getManyMarkmaps));
});
