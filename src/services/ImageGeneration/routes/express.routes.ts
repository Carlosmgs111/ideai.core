import { Router } from "express";
import { generateImages, availabelSettings, modifyImages } from "../";
import { expressHandlerAdapter } from "../../../adapters/apis/express";

const router = Router();

export default router
  .post("/generate", expressHandlerAdapter(generateImages))
  .get("/availablesettings", expressHandlerAdapter(availabelSettings))
  .post("/modifyimages", expressHandlerAdapter(modifyImages));
