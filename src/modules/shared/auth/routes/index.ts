import { RESTAPIService } from "../../../../config/dependencies";
import { signup, login, logout, checkIfIsOnline } from "../use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../infrastructure/schemas/user.schema";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";

export default RESTAPIService.addPath("", (router: any) => {
  router
    .post(
      "/signup",
      RESTAPIService.middlwares.validatorHandler(createUserSchema, "body"),
      expressHandlerAdapter(signup)
    )
    .get(
      "/signin",
      RESTAPIService.middlwares.validatorHandler(getUserSchema, "body"),
      expressHandlerAdapter(login)
    )
    .post(
      "/signin",
      RESTAPIService.middlwares.validatorHandler(getUserSchema, "body"),
      expressHandlerAdapter(login)
    )
    .get("/logout", expressHandlerAdapter(logout))
    .get("/checkifisonline", expressHandlerAdapter(checkIfIsOnline));
});
