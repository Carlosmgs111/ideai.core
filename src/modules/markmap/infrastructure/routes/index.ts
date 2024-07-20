import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
} from "../../../../modules/markmap/application/use_cases";

export default RESTAPIService.addPath()
  .post(
    "/transformfiletomarkmap",
    expressHandlerAdapter(transformFileToMarkmap)
  )
  .put("/update", expressHandlerAdapter(updateMarkmap))
  .get("/getmanymarkmaps", expressHandlerAdapter(getManyMarkmaps));
