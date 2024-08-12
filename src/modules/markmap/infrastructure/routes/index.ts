import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
  createNewMarkmap,
  deleteMarkmap,
  createUsingPrompt,
  createUsingFileAndPrompt,
  updateTitle
} from "../../../../modules/markmap/application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/markmap", (router: any) => {
  router
    .post("/create", controllerAdapter(createNewMarkmap))
    .post("/createusingprompt", controllerAdapter(createUsingPrompt))
    .post(
      "/createusingfileandprompt",
      controllerAdapter(createUsingFileAndPrompt)
    )
    .post("/transformfiletomarkmap", controllerAdapter(transformFileToMarkmap))
    .put("/update", controllerAdapter(updateMarkmap))
    .patch(
      "/update/title",
      controllerAdapter(updateTitle)
    )
    .delete("/delete", controllerAdapter(deleteMarkmap))
    .get("/getmanymarkmaps", controllerAdapter(getManyMarkmaps));
});
