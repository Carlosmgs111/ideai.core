import { Sequelize } from "sequelize";
import config from "../../../../config";

const {
  postgresUserProd,
  postgresPasswordProd,
  postgresHostProd,
  postgresPortProd,
  postgresDatabaseProd,
  postgresDatabaseDev,
  postgresUserDev,
  postgresPasswordDev,
  postgresHostDev,
  postgresPortDev,
  postgresDatabaseTest,
  postgresUserTest,
  postgresPasswordTest,
  postgresHostTest,
  postgresPortTest,
} = config;

let ENV: any = null;
if (process.argv.includes("DEV")) ENV = "DEV";
if (process.argv.includes("PROD")) ENV = "PROD";

let database: string = (() => {
  if (ENV === "DEV") return postgresDatabaseDev;
  if (ENV === "PROD") return postgresDatabaseProd;
  return postgresDatabaseTest;
})();
let user: string = (() => {
  if (ENV === "DEV") return postgresUserDev;
  if (ENV === "PROD") return postgresUserProd;
  return postgresUserTest;
})();
let PASSWORD: string = (() => {
  if (ENV === "DEV") return encodeURIComponent(postgresPasswordDev);
  if (ENV === "PROD") return encodeURIComponent(postgresPasswordProd);
  return encodeURIComponent(postgresPasswordTest);
})();
let host: string = (() => {
  if (ENV === "DEV") return postgresHostDev;
  if (ENV === "PROD") return postgresHostProd;
  return postgresHostTest;
})();
let port: number = (() => {
  if (ENV === "DEV") return Number(postgresPortDev);
  if (ENV === "PROD") return Number(postgresPortProd);
  return Number(postgresPortTest);
})();

export const sequelize = new Sequelize(database, user, PASSWORD, {
  host,
  port,
  dialect: "postgres",
  logging: false, //
});
