import { Router } from "express";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";
import {
  transformFileToMarkmap,
  getManyMarkmaps,
  updateMarkmap,
} from "../../../../modules/markmap/application/use_cases";

const router = Router();

export default router
  .post(
    "/transformfiletomarkmap",
    expressHandlerAdapter(transformFileToMarkmap)
  )
  .put("/update", expressHandlerAdapter(updateMarkmap))
  .get("/getmanymarkmaps", expressHandlerAdapter(getManyMarkmaps));
