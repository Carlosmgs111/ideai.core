import { Router } from "express";
import { expressHandlerAdapter } from "../../../../../adapters/apis/express";
// import { resetPassword } from "../../use_cases";

const router = Router();

export default router.patch(
  "/reset",
  expressHandlerAdapter(() => {})
);
