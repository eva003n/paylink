import { config } from "dotenv-flow";
import { getAbsolutePath } from "../utils/index";
// import { getAbsolutePath } from "../utils/index";

// config({
//   path: getAbsolutePath("../../.env"),
// });

// config({
//   path: getAbsolutePath(`../../.env.${process.env.NODE_ENV || "development"}`),
// });
config({
  files: [
    `${getAbsolutePath("../../.env", __dirname)}`, // The base environment file (loaded first)
    `${getAbsolutePath("../../.env.development", __dirname)}`, // Local overrides (loaded second, overrides .env)
    // `${process.env.NODE_ENV === "production" ? getAbsolutePath("../../.env.production", __dirname) : ""}`, // Environment-specific files (loaded last, overrides all)
  ],
});

export const {
  NODE_ENV,
  PORT,
  CORS_ORIGIN_URLS,
  FRONTEND_BASE_URI,
  COOKIE_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,

  /* ----- Production ----- */
  PROD_CORS_ORIGIN_URLS,
  PROD_FRONTEND_BASE_URI,
  PROD_COOKIE_SECRET,
  PROD_ACCESS_TOKEN_SECRET,
  PROD_REFRESH_TOKEN_SECRET,

  API_DOC_URI,

  /* ---- Postgres and redis database ----*/
  POSTGRES_URL,
  REDIS_URL,

  PROD_POSTGRES_URL,
  PROD_REDIS_URL,

  /* ---- Mail server ---- */
  SMTP_MAIL_SERVER,
  ETHEREAL_USERNAME,
  ETHEREAL_PASSWORD,
  PROD_SMTP_MAIL_SERVER,
  SMTP_MAIL_SERVER_PORT,
  PROD_SMTP_MAIL_SERVER_PORT,
  /*--- Mpesa sandbox--- */
  SANDBOX_CONSUMER_KEY,
  SANDBOX_CONSUMER_SECRET,
  MPESA_SANDBOX_API_URL,
  MPESA_SANDBOX_AUTH_URL,
  MPESA_EXPRESS_SANDBOX_CALLBACK_URL,
  MPESA_EXPRESS_SANDBOX_PASSKEY,
  MPESA_SANDBOX_SHORTCODE,
  MPESA_SANDBOX_PARTYA,
  /* Mpesa Live  */
  PROD_CONSUMER_KEY,
  PROD_CONSUMER_SECRET,
  PROD_MPESA_LIVE_API_URL,
  PROD_MPESA_AUTH_URL,
  PROD_MPESA_EXPRESS_CALLBACK_URL,
  PROD_MPESA_EXPRESS_PASSKEY,
} = process.env;
