import { RESTAPIService } from "../../../../config/dependencies";
import { signup, login, logout } from "../use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../infrastructure/schemas/user.schema";

export default RESTAPIService.addPath("", (router: any) => {
  router
    .post(
      "/signup",
      RESTAPIService.middlwares.validatorHandler(createUserSchema, "body"),
      RESTAPIService.controllerAdapter(signup)
    )
    .get(
      "/signin",
      RESTAPIService.middlwares.validatorHandler(getUserSchema, "body"),
      RESTAPIService.controllerAdapter(login)
    )
    .post(
      "/signin",
      RESTAPIService.middlwares.validatorHandler(getUserSchema, "body"),
      RESTAPIService.controllerAdapter(login)
    )
    .get("/logout", RESTAPIService.controllerAdapter(logout));
});
