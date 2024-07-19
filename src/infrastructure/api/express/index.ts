import express from "express";
import config from "../../../config";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { join, dirname } from "path";
import {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} from "./middlewares/error.handler";
import { grantUrls } from "./middlewares/grantUrls.handler";
import { SocketService } from "../../../config/dependencies";

export const app = express();

app
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
          "markmap/update"
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
  .use(routes)
  .use(logErrors)
  .use(ormErrorHandler)
  .use(boomErrorHandler)
  .use(errorHandler)
  .on("error", (error: any) => {
    console.log({ error });
  });

export default () => {
  SocketService.setServer(app);
  // app.listen(app.get("port"), () => {
  //   console.log(`🚀💼 Portfolio app listening on port ${app.get("port")}`);
  // });
};
