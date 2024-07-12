import { Router } from "express";
import { expressHandlerAdapter } from "../../../../adapters/apis/express";
import { transformFileToMarkmap } from "../../../../modules/markmap/application/use_cases";

const router = Router();

export default router.post("/transformfiletomarkmap", expressHandlerAdapter(transformFileToMarkmap));
