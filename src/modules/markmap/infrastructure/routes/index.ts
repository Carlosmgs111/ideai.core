import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
  createNewMarkmap,
  deleteMarkmap,
  createUsingPrompt,
} from "../../../../modules/markmap/application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/markmap", (router: any) => {
  router
    .post("/create", controllerAdapter(createNewMarkmap))
    .post("/createusingprompt", controllerAdapter(createUsingPrompt))
    .post("/transformfiletomarkmap", controllerAdapter(transformFileToMarkmap))
    .put("/update", controllerAdapter(updateMarkmap))
    .delete("/delete", controllerAdapter(deleteMarkmap))
    .get("/getmanymarkmaps", controllerAdapter(getManyMarkmaps));
});
