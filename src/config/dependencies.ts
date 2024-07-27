import config from "./index";
import { Adapters } from "../services/DatabaseServices";
import {
  DatabaseService as DBS,
  AuthServices as AS,
  SocketService as SS,
  MailerService as MS,
  CachingService as CCHS,
  RESTAPIService as RAS,
} from "../services";

export const RepositoryService = DBS(Adapters.MongooseAdapter);
export const AuthServices = new AS();
export const SocketService: any = new SS();
export const MailerService = new MS();
export const CachingService = new CCHS();
export const RESTAPIService = new RAS();

const apiVersions = ["v1"];
const uiVersions = ["v1"];

export const apiConfig = {
  versions: apiVersions,
  version: apiVersions[apiVersions.length - 1],
};

export const uiConfig = {
  versions: uiVersions,
  version: uiVersions[uiVersions.length - 1],
};
