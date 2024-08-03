import express, { Router } from "express";
import config from "../../config";
import { SocketService } from "../../config/dependencies";
import morgan from "morgan";
import cors from "cors";
// import routes from "./routes";
import { join, dirname } from "path";
import {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} from "./middlewares/error.handler";
import { grantUrls } from "./middlewares/grantUrls.handler";
import { validatorHandler } from "./middlewares/validator.handler";

export class RESTAPIService {
  app: any = null;
  router: any = null;
  middlwares: any = {};
  constructor() {
    this.app = express();
    this.router = Router();
    this.app
      .set("port", config.serverPort)
      .use(morgan("dev"))
      .use(cors({ origin: true }))
      .use(express.json({ limit: "200mb" }))
      .use(express.urlencoded({ limit: "200mb", extended: false }))
      .set("view engine", "pug")
      .set("views", join(dirname(dirname(__dirname)), "templates"))
      // .use(authRoutes)
      // .use(passport)
      .use(
        grantUrls([
          [
            [
              "signin",
              "signup",
              "logout",
              "checkifisonline",
              "/ws/",
              "users/contact",
              "markmap/transformfiletomarkmap",
              "markmap/getmanymarkmaps",
              "markmap/update",
              "markmap/create",
              "users/getallusername",
            ],
            ["POST", "GET", "PUT"],
          ],
        ])
      )
      /* to check */
      .use((req: any, res: any, next: any) => {
        // Dominio que tengan acceso (ej. 'http://example.com')
        res.setHeader("Access-Control-Allow-Origin", "*");
        // Metodos de solicitud que deseas permitir
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PATCH, PUT, DELETE"
        );
        // Encabecedados que permites (ej. 'X-Requested-With,content-type')
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
      })
      .use(this.router)
      .use(logErrors)
      .use(ormErrorHandler)
      .use(boomErrorHandler)
      .use(errorHandler)
      .on("error", (error: any) => {
        console.log({ error });
      });
    this.middlwares = { validatorHandler };
    this.run();
  }
  run = () => {
    SocketService.setServer(this.app);
    // app.listen(app.get("port"), () => {
    //   console.log(`🚀💼 Portfolio app listening on port ${app.get("port")}`);
    // });
  };

  addPath = (path: any, ...middlewares: [Function]) => {
    const subPathRouter: any = Router();
    middlewares.forEach((middleware: Function) => middleware(subPathRouter));
    const pathRouter = Router();
    pathRouter.use(path, subPathRouter);
    return pathRouter;
  };

  controllerAdapter = (handler: any) => {
    return async (req: any, res: any, next: any) => {
      const { body, params, query, user, token } = req;
      try {
        let code = 200;
        let result = await handler({
          ...body,
          ...params,
          ...query,
          user,
          token,
        });

        return res.send(result).status(code);
      } catch (e: any) {
        next(e);
      }
    };
  };
}
