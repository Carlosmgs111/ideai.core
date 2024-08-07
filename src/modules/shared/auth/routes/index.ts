import { RESTAPIService } from "../../../../config/dependencies";
import { signup, login, logout } from "../use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router
    .post("/signup", controllerAdapter(signup))
    .get("/signin", controllerAdapter(login))
    .post("/signin", controllerAdapter(login))
    .get("/logout", controllerAdapter(logout));
});
