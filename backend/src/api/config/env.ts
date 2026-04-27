// import logger from "../logger/logger.winston";
import { getAbsolutePath } from "../utils";


// only use in development
if ((process.env.NODE_ENV || "development") !== "production") {
  const dotenvFlow = require("dotenv-flow");
  dotenvFlow.config({
    files: [
      `${getAbsolutePath("../../../.env", __dirname)}`, // The base environment file (loaded first)
      `${getAbsolutePath(`../../../.env.development`, __dirname)}`, // Local overrides (loaded second, overrides .env)
    ],
  });
}

export const {
  NODE_ENV,
  PORT,
  CORS_ORIGIN_URLS,
  FRONTEND_BASE_URI,
  COOKIE_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,

  API_DOC_URI,

  /* ---- Postgres and redis database ----*/
  POSTGRES_URL,
  REDIS_URL,

  // PROD_POSTGRES_URL,
  // PROD_REDIS_URL,

  /* ---- Mail server ---- */
  SMTP_MAIL_SERVER,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_MAIL_SERVER_PORT,
  APP_EMAIL,
  /* --- M-Pesa --- */
  CONSUMER_KEY,
  CONSUMER_SECRET,
  MPESA_API_URL,
  MPESA_AUTH_URL,
  MPESA_EXPRESS_CALLBACK_URL,
  MPESA_EXPRESS_PASSKEY,
  MPESA_SHORTCODE,
  MPESA_PARTYA,
} = process.env;
