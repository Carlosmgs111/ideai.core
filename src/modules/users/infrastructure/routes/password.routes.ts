import { Router } from "express";
import { RESTAPIService } from "../../../../config/dependencies";
// import { resetPassword } from "../../use_cases";

const router = Router();

export default router.patch(
  "/reset",
  RESTAPIService.controllerAdapter(() => {})
);
