import { RESTAPIService, apiConfig } from "../../../../config/dependencies";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  createNewMarkmap,
  deleteMarkmap,
  createUsingPrompt,
  createUsingFileAndPrompt,
  update,
  getCountOfMarkmaps,
  updateAllMarkmapsWithNewAttributes,
  associateAllOrphanMarkmapsToSingleUser,
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
    .patch("/update", controllerAdapter(update))
    .delete("/delete", controllerAdapter(deleteMarkmap))
    .get("/getmanymarkmaps", controllerAdapter(getManyMarkmaps))
    .get("/countofmarkmaps", controllerAdapter(getCountOfMarkmaps))
    .get(
      "/updateallmarkmapswithnewattributes",
      controllerAdapter(updateAllMarkmapsWithNewAttributes)
    )
    .get(
      "/associateallorphanmarkmapstosingleuser",
      controllerAdapter(associateAllOrphanMarkmapsToSingleUser)
    );
});
