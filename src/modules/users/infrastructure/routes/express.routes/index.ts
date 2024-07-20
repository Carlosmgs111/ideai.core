import { RESTAPIService } from "../../../../../config/dependencies";
import passwordRoutes from "./password.routes";
// import {
//   registerUser,
//   removeUser,
//   updateUser,
//   sayHello,
//   changeUsername,
//   updateAvatar,
//   getAllUsername,
//   contactByEmail,
// } from "../../use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../../infrastructure/schemas/user.schema";
// import { validatorHandler } from "../../../../../infrastructure/api/express/middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../../adapters/apis/express";

export default RESTAPIService.addPath()
  .get(
    "/",
    expressHandlerAdapter(() => {})
  )
  .use("/password", passwordRoutes);
