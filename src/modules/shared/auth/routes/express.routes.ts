import { Router } from "express";
import { signup, login, logout, checkIfIsOnline } from "../use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../infrastructure/schemas/user.schema";
import { validatorHandler } from "../../../../infrastructure/api/express/middlewares/validator.handler";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";
const router = Router();

export default router
  .post(
    "/signup",
    validatorHandler(createUserSchema, "body"),
    expressHandlerAdapter(signup)
  )
  .get(
    "/signin",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(login)
  )
  .post(
    "/signin",
    validatorHandler(getUserSchema, "body"),
    expressHandlerAdapter(login)
  )
  .get("/logout", expressHandlerAdapter(logout))
  .get("/checkifisonline", expressHandlerAdapter(checkIfIsOnline));
