import { RESTAPIService } from "../../../../config/dependencies";
import passwordRoutes from "./password.routes";
import { getAllUsername } from "../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/users", (router: any) => {
  router
    .get(
      "/",
      controllerAdapter(() => {})
    )
    .get("/getallusername", controllerAdapter(getAllUsername))
    .use("/password", passwordRoutes);
});
