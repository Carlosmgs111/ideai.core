import { RESTAPIService } from "../../../../config/dependencies";
import passwordRoutes from "./password.routes";
import {
  //   registerUser,
  //   removeUser,
  //   updateUser,
  //   sayHello,
  //   changeUsername,
  //   updateAvatar,
  getAllUsername,
  //   contactByEmail,
} from "../../application/use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../infrastructure/schemas/user.schema";
// import { validatorHandler } from "../../../../../infrastructure/api/express/middlewares/validator.handler";

export default RESTAPIService.addPath("/users", (router: any) => {
  router
    .get(
      "/",
      RESTAPIService.controllerAdapter(() => {})
    )
    .get("/getallusername", RESTAPIService.controllerAdapter(getAllUsername))
    .use("/password", passwordRoutes);
});
