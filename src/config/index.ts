import dotenv from "dotenv";
dotenv.config();

const config = {
  mongoDBLocalUrl: String(process.env.MONGODB_LOCAL_URL || ""),
  mongoDBTestUrl: String(process.env.MONGODB_TEST_URL || ""),
  mongoDBAtlasURL: String(process.env.MONGODB_ATLAS_URL || ""),
  /*  */
  postgresDatabaseProd: String(process.env.POSTGRES_DATABASE_PROD || ""),
  postgresUserProd: String(process.env.POSTGRES_USER_PROD || ""),
  postgresPasswordProd: String(process.env.POSTGRES_PASSWORD_PROD || ""),
  postgresHostProd: String(process.env.POSTGRES_HOST_PROD || ""),
  postgresPortProd: String(process.env.POSTGRES_PORT_PROD || ""),
  /*  */
  postgresDatabaseDev: String(process.env.POSTGRES_DATABASE_DEV || ""),
  postgresUserDev: String(process.env.POSTGRES_USER_DEV || ""),
  postgresPasswordDev: String(process.env.POSTGRES_PASSWORD_DEV || ""),
  postgresHostDev: String(process.env.POSTGRES_HOST_DEV || ""),
  postgresPortDev: String(process.env.POSTGRES_PORT_DEV || ""),
  /*  */
  postgresDatabaseTest: String(process.env.POSTGRES_DATABASE_TEST || ""),
  postgresUserTest: String(process.env.POSTGRES_USER_TEST || ""),
  postgresPasswordTest: String(process.env.POSTGRES_PASSWORD_TEST || ""),
  postgresHostTest: String(process.env.POSTGRES_HOST_TEST || ""),
  postgresPortTest: String(process.env.POSTGRES_PORT_TEST || ""),
  /*  */
  serverPort: String(process.env.PORT || ""),
  jwtAccessSecret: String(process.env.JWT_ACCESS_SECRET || ""),
  jwtSignupSecret: String(process.env.JWT_SIGNUP_SECRET || ""),
  apiKey: String(process.env.API_KEY || ""),
  /*  */
  socketServicePort: Number(process.env.SOCKET_SERVICE_PORT || ""),
  /*  */
  // jwtResetPasswordSecret: String(process.env.JWT_RESET_PASSWORD_SECRET),
  jwtExp: String(process.env.TOKEN_EXPIRATION || ""),
  test: String(process.env.test || ""),
  /*  */
  redisUrlProd: String(process.env.REDIS_URL_PROD || ""),
  redisUrlDev: String(process.env.REDIS_URL_DEV || ""),
  redisHost: String(process.env.REDIS_HOST || ""),
  redisPort: String(process.env.REDIS_PORT || ""),
  redisUser: String(process.env.REDIS_USER || ""),
  redisPassword: String(process.env.REDIS_PASSWORD || ""),
  /*  */
  rabbitMQUrlDev: String(process.env.RABBITMQ_URL_DEV || ""),
  rabbitMQUrlProd: String(process.env.RABBITMQ_URL_PROD || ""),
  /*  */
  imageServiceUrlDev: String(process.env.IMAGE_SERVICE_URL_DEV || ""),
  imageServiceUrlProd: String(process.env.IMAGE_SERVICE_URL_PROD || ""),
  websocketPath: String(process.env.WEBSOCKET_PATH || ""),
  // MAILER CREDENTIALS
  mailerEmailAddress: String(process.env.MAILER_EMAIL_ADDRESS || ""),
  mailerEmailAppPassword: String(process.env.MAILER_EMAIL_APP_PASSWORD || ""),
  // user
  contactEmailAddress: String(process.env.CONTACT_EMAIL_ADDRESS || ""),
  /*  */
  appName: String(process.env.APP_NAME || ""),
  /*  */
  replicateApiToken: String(process.env.REPLICATE_API_TOKEN || ""),
  groqApiKey: String(process.env.GROQ_API_KEY || ""),
};

export default config;
