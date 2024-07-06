import config from "../../../../config";

const {
  postgresUserDev,
  postgresPasswordDev,
  postgresHostDev,
  postgresPortDev,
  postgresDatabaseDev,
  postgresUserProd,
  postgresPasswordProd,
  postgresHostProd,
  postgresPortProd,
  postgresDatabaseProd,
  postgresUserTest,
  postgresPasswordTest,
  postgresHostTest,
  postgresPortTest,
  postgresDatabaseTest,
} = config;

const test = false;
const PROD = true; // ? true for use in production

const USER = !PROD
  ? encodeURIComponent(postgresUserDev || "")
  : encodeURIComponent(postgresUserProd || "");

const PASSWORD = !PROD
  ? encodeURIComponent(postgresPasswordDev || "")
  : encodeURIComponent(postgresPasswordProd || "");

const URI = `postgres://${USER}:${PASSWORD}@${
  !PROD ? postgresHostDev : postgresHostProd
}:${!PROD ? postgresPortDev : postgresPortProd}/${
  !test
    ? !PROD
      ? postgresDatabaseDev
      : postgresDatabaseProd
    : postgresDatabaseTest
}`;
console.log({ URI });
export = {
  development: {
    url: URI,
    dialect: "postgres",
  },
  production: {
    url: URI,
    dialect: "postgres",
  },
};
